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
            alliance: "1",
            teams: ["4931", "4931", "4931"],
            status: "winner"
          },
          {
            alliance: "8",
            teams: ["4931", "4931", "4931"],
            status: "loser"
          },
          {
            alliance: "4",
            teams: ["4931", "4931", "4931"],
            status: "loser"
          },
          {
            alliance: "5",
            teams: ["4931", "4931", "4931"],
            status: "winner"
          },
          {
            alliance: "3",
            teams: ["4931", "4931", "4931"],
            status: "winner"
          },
          {
            alliance: "6",
            teams: ["4931", "4931", "4931"],
            status: "loser"
          },
          {
            alliance: "2",
            teams: ["4931", "4931", "4931"],
            status: "winner"
          },
          {
            alliance: "7",
            teams: ["4931", "4931", "4931"],
            status: "loser"
          }
        ],
        sf: [
          {
            alliance: "1",
            teams: ["4931", "4931", "4931"],
            status: "loser"
          },
          {
            alliance: "5",
            teams: ["4931", "4931", "4931"],
            status: "winner"
          },
          {
            alliance: "3",
            teams: ["4931", "4931", "4931"],
            status: "winner"
          },
          {
            alliance: "2",
            teams: ["4931", "4931", "4931"],
            status: "loser"
          }
        ],
        f: [
          {
            alliance: "5",
            teams: ["4931", "4931", "4931"],
            status: "winner"
          },
          {
            alliance: "3",
            teams: ["4931", "4931", "4931"],
            status: "loser"
          }
        ],
        w: [
          {
            alliance: "5",
            teams: ["4931", "4931", "4931"],
            status: "winner"
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
    addToBracketData(level, alliance, teams, status) {
      var pos = 0;
      var location = 0;

      switch (level) {
        case "qf":
          pos = 8;
        case "sf":
          pos = 4;
        case "f":
          pos = 2;
        case "w":
          pos = 1;
      }

      // this.bracketData[level][location] = {
      //   alliance: alliance,
      //   teams: teams,
      //   status: status
      // };
    },
    reloadAlliances() {
      var dThis = this;

      this.localtbadb.get("ALLIANCES").then(function(doc) {
        // dThis.bracketData = [];

        console.log(doc);

        // var data = [];

        for (var alliance in doc.json) {
          var allianceData = doc.json[alliance];

          var level = allianceData.level;
          var status = allianceData.status.status;
          var teams = [];

          if (level == "f" && status == "won") level = "w";

          dThis.addToBracketData(level, allianceData.picks, status);
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
  --a-width: 200px;
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
</style>