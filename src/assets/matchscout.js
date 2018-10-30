export default {
  name: "MatchTemplate",
  fields: [
    {
      "type": "TitleField",
      "title": "Autonomous"
    },
    {
      "type": "BooleanField",
      "title": "Cross Center Line",
      "field": "auto_centerline",
      "default": false,
      "points": [3, 0]
    },
    {
      "type": "NumberFieldInc",
      "title": "Blocks (Allience Switch)",
      "field": "auto_alli_switch",
      "default": 0,
      "points": 2,
      "min": 0
    },
    {
      "type": "NumberFieldInc",
      "title": "Blocks (Allience Scale)",
      "field": "auto_alli_scale",
      "default": 0,
      "points": 3,
      "min": 0
    },
    {
      "type": "TitleField",
      "title": "TeleOp"
    },
    {
      "type": "NumberFieldInc",
      "title": "Blocks (Allience Switch)",
      "field": "teleop_alli_switch",
      "default": 0,
      "points": 1,
      "min": 0
    },
    {
      "type": "NumberFieldInc",
      "title": "Blocks (Allience Scale)",
      "field": "teleop_alli_scale",
      "default": 0,
      "points": 1,
      "min": 0
    },
    {
      "type": "NumberFieldInc",
      "title": "Blocks (Opponent Switch)",
      "field": "teleop_opp_switch",
      "default": 0,
      "points": 1,
      "min": 0
    },
    {
      "type": "TitleField",
      "title": "End Game + Other"
    },
    {
      "type": "DropdownField",
      "title": "End",
      "field": "end_position",
      "default": "None",
      "options": ["None", "Park", "Hang", "Double Hang", "Supported A Double Hang", "Triple Hang", "Supported A Tripple Hang"],
      "points": [0, 1, 5, 7, 7, 10, 15]
    },
    {
      "type": "DropdownField",
      "title": "Power Up Usage",
      "field": "other_powerupUsage",
      "default": "None Used",
      "options": ["None Used", "Poor", "Average", "Exelent"],
      "points": [0, 1, 2, 3]
    }
  ]
};