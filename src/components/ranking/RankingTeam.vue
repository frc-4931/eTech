<template>
  <div class="background-box ranking-team-container mobile-shrink">
    <p>{{ teamData.rank}}</p>
    <p>{{ teamName }}</p>
    <p>{{ teamNumber }}</p>
    <p>{{ teamData.record.wins }}</p>
    <p>{{ teamData.record.losses }}</p>
    <p>{{ teamData.record.ties }}</p>
    <p>{{ winPercentage }}</p>
    <p>{{ teamData.extra_stats[0] }}</p>
  </div>
</template>

<script>
export default {
  name: "RankingTeam",
  props: {
    teamData: Object,
    bluealliancedb: Object
  },
  data: function() {
    return {
      teamName: "Loading..."
    };
  },
  computed: {
    teamNumber: function() {
      return this.teamData.team_key.substr(3);
    },
    winPercentage: function() {
      return (
        (
          ((this.teamData.record.ties / 2 + this.teamData.record.wins) /
            this.teamData.matches_played) *
          100
        ).toFixed(2) + "%"
      );
    }
  },
  created: function() {
    var dThis = this;

    this.bluealliancedb.get("TEAM_" + this.teamNumber).then(function(doc) {
      dThis.teamName = doc.json.nickname;
    });
  }
};
</script>