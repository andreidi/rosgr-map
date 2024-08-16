import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChild,
  EventEmitter,
  forwardRef,
  inject,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  TemplateRef,
  ViewEncapsulation,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { NgTemplateOutlet } from '@angular/common';

import { NgbRatingConfig } from './rating-config';

/**
 * The context for the custom star display template defined in the `starTemplate`.
 */
export interface StarTemplateContext {
  /**
   * The star fill percentage, an integer in the `[0, 100]` range.
   */
  fill: number;

  /**
   * Index of the star, starts with `0`.
   */
  index: number;
}

/**
 * A directive that helps visualising and interacting with a star rating bar.
 */
@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'ngb-rating',
  standalone: true,
  imports: [NgTemplateOutlet],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    class: 'd-inline-flex',
    '[tabindex]': 'disabled ? -1 : tabindex',
    role: 'slider',
    'aria-valuemin': '0',
    '[attr.aria-valuemax]': 'max',
    '[attr.aria-valuenow]': 'nextRate',
    '[attr.aria-valuetext]': 'ariaValueText(nextRate, max)',
    '[attr.aria-readonly]': 'readonly && !disabled ? true : null',
    '[attr.aria-disabled]': 'disabled ? true : null',
    '(blur)': 'handleBlur()',
    '(keydown)': 'handleKeyDown($event)',
    '(mouseleave)': 'reset()',
  },
  templateUrl: './rating.component.html',
  styleUrl: './rating.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => NgbRatingComponent),
      multi: true,
    },
  ],
})
export class NgbRatingComponent
  implements ControlValueAccessor, OnInit, OnChanges
{
  contexts: StarTemplateContext[] = [];
  nextRate!: number;

  private _config = inject(NgbRatingConfig);
  private _changeDetectorRef = inject(ChangeDetectorRef);

  /**
   * If `true`, the rating can't be changed or focused.
   */
  @Input() disabled = false;

  /**
   * The maximal rating that can be given.
   */
  @Input() max = this._config.max;

  /**
   * The current rating. Could be a decimal value like `3.75`.
   */
  @Input() rate = 0;

  /**
   * If `true`, the rating can't be changed.
   */
  @Input() readonly = this._config.readonly;

  /**
   * If `true`, the rating can be reset to `0` by mouse clicking currently set rating.
   */
  @Input() resettable = this._config.resettable;

  @Input() iconSize = this._config.iconSize;

  /**
   * The template to override the way each star is displayed.
   *
   * Alternatively put an `<ng-template>` as the only child of your `<ngb-rating>` element
   */
  @Input()
  starTemplate!: TemplateRef<StarTemplateContext>;
  @ContentChild(TemplateRef, { static: false })
  starTemplateFromContent!: TemplateRef<StarTemplateContext>;

  /**
   * Allows setting a custom rating tabindex.
   * If the component is disabled, `tabindex` will still be set to `-1`.
   *
   * @since 13.1.0
   */
  @Input() tabindex = this._config.tabindex;

  /**
   * Allows to provide a function to set a custom aria-valuetext
   *
   * @since 14.1.0
   */
  @Input() ariaValueText(current: number, max: number) {
    return `${current} out of ${max}`;
  }

  /**
   * An event emitted when the user is hovering over a given rating.
   *
   * Event payload equals to the rating being hovered over.
   */
  @Output() hover = new EventEmitter<number>();

  /**
   * An event emitted when the user stops hovering over a given rating.
   *
   * Event payload equals to the rating of the last item being hovered over.
   */
  @Output() leave = new EventEmitter<number>();

  /**
   * An event emitted when the rating is changed.
   *
   * Event payload equals to the newly selected rating.
   */
  @Output() rateChange = new EventEmitter<number>(true);

  // eslint-disable-next-line @typescript-eslint/no-empty-function, @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
  onChange = (_: any) => {};
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onTouched = () => {};

  isInteractive(): boolean {
    return !this.readonly && !this.disabled;
  }

  enter(value: number): void {
    if (this.isInteractive()) {
      this._updateState(value);
    }
    this.hover.emit(value);
  }

  handleBlur() {
    this.onTouched();
  }

  handleClick(value: number) {
    if (this.isInteractive()) {
      this.update(this.resettable && this.rate === value ? 0 : value);
    }
  }

  handleKeyDown(event: KeyboardEvent) {
    switch (event.key) {
      case 'ArrowDown':
      case 'ArrowLeft':
        this.update(this.rate - 1);
        break;
      case 'ArrowUp':
      case 'ArrowRight':
        this.update(this.rate + 1);
        break;
      case 'Home':
        this.update(0);
        break;
      case 'End':
        this.update(this.max);
        break;
      default:
        return;
    }

    // note 'return' in default case
    event.preventDefault();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['rate']) {
      this.update(this.rate);
    }
    if (changes['max']) {
      this._updateMax();
    }
  }

  ngOnInit(): void {
    this._setupContexts();
    this._updateState(this.rate);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  registerOnChange(fn: (value: any) => any): void {
    this.onChange = fn;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  registerOnTouched(fn: () => any): void {
    this.onTouched = fn;
  }

  reset(): void {
    this.leave.emit(this.nextRate);
    this._updateState(this.rate);
  }

  setDisabledState(isDisabled: boolean) {
    this.disabled = isDisabled;
  }

  update(value: number, internalChange = true): void {
    const newRate = this._getValueInRange(value, this.max, 0);
    if (this.isInteractive() && this.rate !== newRate) {
      this.rate = newRate;
      this.rateChange.emit(this.rate);
    }
    if (internalChange) {
      this.onChange(this.rate);
      this.onTouched();
    }
    this._updateState(this.rate);
  }

  writeValue(value: number) {
    this.update(value, false);
    this._changeDetectorRef.markForCheck();
  }

  private _updateState(nextValue: number) {
    this.nextRate = nextValue;
    this.contexts.forEach(
      (context, index) =>
        (context.fill = Math.round(
          this._getValueInRange(nextValue - index, 1, 0) * 100,
        )),
    );
  }

  private _updateMax() {
    if (this.max > 0) {
      this._setupContexts();
      this.update(this.rate);
    }
  }

  private _setupContexts() {
    this.contexts = Array.from({ length: this.max }, (v, k) => ({
      fill: 0,
      index: k,
    }));
  }

  private _getValueInRange(value: number, max: number, min = 0): number {
    return Math.max(Math.min(value, max), min);
  }
}
