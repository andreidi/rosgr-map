# Contributing

### Proposing new locations

Currently, locations are available in [locations.json](public/assets/locations.json) file.
A new location should use the following format:

- `name`: _string_ - A name for the location,
- `lat`: _number_ - A number representing the latitude coordinate - ideally retrieved from Google Maps,
- `lng`: _number_ - A number representing the longitude coordinate - ideally retrieved from Google Maps,
- `address`: _string_ - Human-readable address. It can be retrieved from Google Maps,
- `city`: _string_ - Name of the city where the RVM is situated,
- `county`: _string_ - Name of the county where the RVM is situated,
- `rvmCount`: number - Count of available RVMs, or how many people can return packages in the same time,
- `type`: _string_ - The type of service. Possible values: Automat | Manual,
- `schedules`: An array containing objects with the following structure:
  - `day`: _string_ - A day or days interval when the RVM is open or closed.
  - `hoursInterval`: _string_ - A hours interval for the above day when the RVM is open or closed.

You can either [fork the repo](https://help.github.com/en/github/getting-started-with-github/fork-a-repo) and [create a pull request](https://help.github.com/en/github/collaborating-with-issues-and-pull-requests/proposing-changes-to-your-work-with-pull-requests) for location changes, or open an issue to propose a new location.

Example location object:

```json
{
  "name": "Punct colectare Piața Victoriei",
  "lat": 44.452875264001484,
  "lng": 26.08743111520388,
  "address": "Piața Victoriei 1, București 011791",
  "city": "București",
  "county": "București",
  "rvmCount": 4,
  "type": "Automat",
  "schedules": [
    {
      "day": "L-V",
      "hoursInterval": "07-22"
    },
    {
     "day": "Sambata",
     "hoursInterval": "09-20"
    },
    {
      "day": "Duminica",
      "hoursInterval": "Inchis"
    }
  ]
}
```

### Proposing new features

As with proposing new locations, you can either [fork the repo](https://help.github.com/en/github/getting-started-with-github/fork-a-repo) and [create a pull request](https://help.github.com/en/github/collaborating-with-issues-and-pull-requests/proposing-changes-to-your-work-with-pull-requests) for new features, or open an issue to propose and discuss a new feature.
