export default {
  name: "PitTemplate",
  fields: [
    {
      "type": "TitleField",
      "title": "General"
    },
    {
      "type": "DropdownField",
      "title": "Drivetrain:",
      "field": "drivetrain",
      "options": [
        "Tank",
        "Mecanum",
        "Swerve",
        "Half Omni",
        "Shopping Cart"
      ],
      "points": [
        0,
        0,
        2,
        0,
        0
      ],
      "default": "Tank"
    },
    {
      "type": "TitleField",
      "title": "Autonomous"
    },
    {
      "type": "BooleanField",
      "title": "Cross Center Line:",
      "field": "auto_centerline",
      "default": false,
      "points": [
        3,
        0
      ]
    },
    {
      "type": "NumberField",
      "title": "Blocks In Switch:",
      "field": "auto_switch",
      "default": 0,
      "points": 3
    },
    {
      "type": "NumberField",
      "title": "Blocks In Scale:",
      "field": "auto_scale",
      "default": 5,
      "points": 5
    },
    {
      "type": "BooleanField",
      "title": "Work Around Us:",
      "field": "auto_aroundus",
      "default": true,
      "points": [
        5,
        0
      ]
    }
  ]
};