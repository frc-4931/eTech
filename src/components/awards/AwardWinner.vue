<template>
  <div class="tba-awards-container background-box">
    <p>{{ winnerData.name}}</p>

    <div>
      <div v-for="recipient in winnerData.recipient_list" :key="recipient.team_key + recipient.awardee">
        <router-link v-if="recipient.awardee == null && recipient.team_key != null" :to="{name: 'team', params: {number: recipient.team_key.substr(3)}}">{{ recipient.team_key.substr(3) }}</router-link>

        <p v-if="recipient.awardee != null && recipient.team_key == null">{{ recipient.awardee }}</p>

        <p v-if="recipient.awardee != null && recipient.team_key != null">
          {{ recipient.awardee }} from
          <router-link :to="{name: 'team', params: {number: recipient.team_key.substr(3)}}">{{recipient.team_key.substr(3)}}</router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "AwardWinner",
  props: {
    winnerData: Object
  }
};
</script>