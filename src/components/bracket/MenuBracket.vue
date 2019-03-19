<template>
  <div class="grid">
    <div class="location-centered bracket-container">
      <div class="bracket-qf bracket-sub-container">
        <BracketSlot
          :level="'qf'"
          :location="'0'"
          :bracketData="bracketData"
        />
        <BracketConnectorLine />

        <BracketSlot
          :level="'qf'"
          :location="'1'"
          :bracketData="bracketData"
          class="bracket-slot-small-top"
        />
        <BracketConnectorLine />

        <BracketSlot
          :level="'qf'"
          :location="'2'"
          :bracketData="bracketData"
        />
        <BracketConnectorLine />

        <BracketSlot
          :level="'qf'"
          :location="'3'"
          :bracketData="bracketData"
          class="bracket-slot-small-top"
        />
        <BracketConnectorLine />

        <BracketSlot
          :level="'qf'"
          :location="'4'"
          :bracketData="bracketData"
        />
        <BracketConnectorLine />

        <BracketSlot
          :level="'qf'"
          :location="'5'"
          :bracketData="bracketData"
          class="bracket-slot-small-top"
        />
        <BracketConnectorLine />

        <BracketSlot
          :level="'qf'"
          :location="'6'"
          :bracketData="bracketData"
        />
        <BracketConnectorLine />

        <BracketSlot
          :level="'qf'"
          :location="'7'"
          :bracketData="bracketData"
          class="bracket-slot-small-top"
        />
        <BracketConnectorLine />

      </div>
      <div class="bracket-sf bracket-sub-container">
        <BracketConnectorLine />
        <BracketSlot
          :level="'sf'"
          :location="'0'"
          :bracketData="bracketData"
        />
        <BracketConnectorLine />

        <BracketConnectorLine />
        <BracketSlot
          :level="'sf'"
          :location="'1'"
          :bracketData="bracketData"
          class="bracket-slot-small-top"
        />
        <BracketConnectorLine />

        <BracketConnectorLine />
        <BracketSlot
          :level="'sf'"
          :location="'2'"
          :bracketData="bracketData"
        />
        <BracketConnectorLine />

        <BracketConnectorLine />
        <BracketSlot
          :level="'sf'"
          :location="'3'"
          :bracketData="bracketData"
          class="bracket-slot-small-top"
        />
        <BracketConnectorLine />
      </div>
      <div class="bracket-f bracket-sub-container">
        <BracketConnectorLine />
        <BracketSlot
          :level="'f'"
          :location="'0'"
          :bracketData="bracketData"
        />
        <BracketConnectorLine />

        <BracketConnectorLine />
        <BracketSlot
          :level="'f'"
          :location="'1'"
          :bracketData="bracketData"
        />
        <BracketConnectorLine />

      </div>
      <div class="bracket-winner bracket-sub-container">
        <BracketConnectorLine />
        <BracketSlot
          :level="'w'"
          :location="'0'"
          :bracketData="bracketData"
        />
      </div>
    </div>
  </div>
</template>

<script>
import BracketSlot from "./BracketSlot.vue";
import BracketConnectorLine from "./BracketConnectorLine.vue";

export default {
  name: "MenuBracket",
  components: {
    BracketSlot,
    BracketConnectorLine
  },
  data: function() {
    return {
      bracketData: {
        qf: [
          {
            alliance: "?",
            teams: ["???", "???", "???"],
            status: "undefined"
          },
          {
            alliance: "?",
            teams: ["???", "???", "???"],
            status: "undefined"
          },
          {
            alliance: "?",
            teams: ["???", "???", "???"],
            status: "undefined"
          },
          {
            alliance: "?",
            teams: ["???", "???", "???"],
            status: "undefined"
          },
          {
            alliance: "?",
            teams: ["???", "???", "???"],
            status: "undefined"
          },
          {
            alliance: "?",
            teams: ["???", "???", "???"],
            status: "undefined"
          },
          {
            alliance: "?",
            teams: ["???", "???", "???"],
            status: "undefined"
          },
          {
            alliance: "?",
            teams: ["???", "???", "???"],
            status: "undefined"
          }
        ],
        sf: [
          {
            alliance: "?",
            teams: ["???", "???", "???"],
            status: "undefined"
          },
          {
            alliance: "?",
            teams: ["???", "???", "???"],
            status: "undefined"
          },
          {
            alliance: "?",
            teams: ["???", "???", "???"],
            status: "undefined"
          },
          {
            alliance: "?",
            teams: ["???", "???", "???"],
            status: "undefined"
          }
        ],
        f: [
          {
            alliance: "?",
            teams: ["???", "???", "???"],
            status: "undefined"
          },
          {
            alliance: "?",
            teams: ["???", "???", "???"],
            status: "undefined"
          }
        ],
        w: [
          {
            alliance: "?",
            teams: ["???", "???", "???"],
            status: "undefined"
          }
        ]
      }
    };
  },
  props: {
    localtbadb: Object,
    sync_change: Object
  },
  methods: {
    addToBracketData(level, eliminatedLevel, location, alliance, teams) {
      var status = "loser";

      if (level != eliminatedLevel) {
        status = "winner";

        var l = "";

        switch (level) {
          case "qf":
            l = "sf";
            break;
          case "sf":
            l = "f";
            break;
          case "f":
            l = "w";
            break;
        }

        this.addToBracketData(
          l,
          eliminatedLevel,
          Math.floor(location / 2),
          alliance,
          teams
        );
      } else if (level == "w") {
        status = "winner";
      }

      this.bracketData[level][location].alliance = alliance;
      this.bracketData[level][location].teams = teams;
      this.bracketData[level][location].status = status;
    },
    reloadAlliances() {
      var dThis = this;

      this.localtbadb.get("ALLIANCES").then(function(doc) {
        for (var alliance in doc.json) {
          var allianceData = doc.json[alliance];

          var eliminatedLevel = allianceData.status.level;
          var alliance = parseInt(allianceData.name.split(" ")[1]);
          var teams = [];

          allianceData.picks.forEach(function(team) {
            teams.push(team.replace("frc", ""));
          });

          if (eliminatedLevel == "f" && allianceData.status.status == "won")
            eliminatedLevel = "w";

          var locations = {
            alliance1: 0,
            alliance8: 1,
            alliance4: 2,
            alliance5: 3,
            alliance3: 4,
            alliance6: 5,
            alliance2: 6,
            alliance7: 7
          };

          var location = locations["alliance" + alliance];

          dThis.addToBracketData(
            "qf",
            eliminatedLevel,
            location,
            alliance,
            teams
          );
        }
      });
    }
  },
  created: function() {
    this.reloadAlliances();

    this.sync_change.onBlueAllianceDbChange = function(change) {
      if (change["direction"] == "pull") {
        for (var doc of change["change"]["docs"]) {
          if (doc["_id"] === "ALLIANCES") {
            dThis.reloadAlliances();
          }
        }
      }
    };
  }
};
</script>

<style>
.bracket-container {
  --a-width: 220px;
  --l-width: 15px;

  display: grid;
  grid-template-columns:
    calc(var(--a-width) + var(--l-width)) repeat(
      2,
      calc(var(--l-width) + var(--a-width) + var(--l-width))
    )
    calc(var(--a-width) + var(--l-width));

  overflow-x: scroll;
  padding-right: 10px;
  padding-left: 10px;
}
.bracket-sub-container {
  display: grid;
}
.bracket-qf {
  grid-template-columns: var(--a-width) var(--l-width);
  grid-template-rows: repeat(8, 1fr);
}
.bracket-sf {
  grid-template-columns: var(--l-width) var(--a-width) var(--l-width);
  grid-template-rows: repeat(4, 1fr);
}
.bracket-f {
  grid-template-columns: var(--l-width) var(--a-width) var(--l-width);
  grid-template-rows: repeat(2, 1fr);
}
.bracket-winner {
  grid-template-columns: var(--l-width) var(--a-width);
  grid-template-rows: repeat(1, 1fr);
}
.bracket-slot-small-top .bracket-slot {
  margin-top: 0px;
}
</style>