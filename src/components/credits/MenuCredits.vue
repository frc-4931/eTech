<template>
  <div class="grid">
    <div class="location-centered-small">
      <h1 class="background-box content-centered">About</h1>
      <p class="background-box content-justified">
        eTech is an all-in-one web application that allows users to continue
        scouting when offline, and when the user revives their connection the
        information is automatically synced to all other devices, and their
        screens are updated in real time.
      </p>
      <div class="background-box">
        <p class="content-justified">
          <a href="https://github.com/frc-4931/eTech" target="_blank">Github</a>
        </p>
      </div>
    </div>

    <div class="location-centered-small credits-container">
      <h1 class="location-centered-small background-box content-centered">
        Credits
      </h1>

      <div class="grid-perminant">
        <div class="location-left">
          <p class="background-box">Programming</p>
        </div>
        <div class="location-right">
          <p class="background-box">James Crane</p>
          <p class="background-box">Damian Kocher</p>
        </div>

        <div class="location-left">
          <p class="background-box">User Interface</p>
        </div>
        <div class="location-right">
          <p class="background-box">Damian Kocher</p>
        </div>

        <div class="location-left">
          <p class="background-box">!</p>
        </div>
        <div class="location-right">
          <p class="background-box">
            <a href="http://evilletech.com/" target="_blank"
              >Edwardsville Technologies</a
            >
          </p>
        </div>
      </div>
    </div>

    <div class="location-centered-small credits-container">
      <h1 class="location-centered-small background-box content-centered">
        Licenses
      </h1>

      <div class="grid-perminant">
        <div class="location-left">
          <p class="background-box">Vue</p>
        </div>
        <div class="location-right">
          <p class="background-box">MIT</p>
        </div>

        <div class="location-left">
          <p class="background-box">Vue-CLI</p>
        </div>
        <div class="location-right">
          <p class="background-box">MIT</p>
        </div>

        <div class="location-left">
          <p class="background-box">Vue-Router</p>
        </div>
        <div class="location-right">
          <p class="background-box">MIT</p>
        </div>

        <div class="location-left">
          <p class="background-box">Vue-Scrollto</p>
        </div>
        <div class="location-right">
          <p class="background-box">MIT</p>
        </div>

        <div class="location-left">
          <p class="background-box">PouchDB</p>
        </div>
        <div class="location-right">
          <p class="background-box">Apache License 2.0</p>
        </div>

        <div class="location-left">
          <p class="background-box">PouchDB-Authentication</p>
        </div>
        <div class="location-right">
          <p class="background-box">Apache License 2.0</p>
        </div>

        <div class="location-left">
          <p class="background-box">Chalk</p>
        </div>
        <div class="location-right">
          <p class="background-box">MIT</p>
        </div>

        <div class="location-left">
          <p class="background-box">Command-Line-Args</p>
        </div>
        <div class="location-right">
          <p class="background-box">MIT</p>
        </div>

        <div class="location-left">
          <p class="background-box">Command-Line-Usage</p>
        </div>
        <div class="location-right">
          <p class="background-box">MIT</p>
        </div>

        <div class="location-left">
          <p class="background-box">HTTP</p>
        </div>
        <div class="location-right">
          <p class="background-box">BSD-2-Clause</p>
        </div>

        <div class="location-left">
          <p class="background-box">HTTP-Proxy</p>
        </div>
        <div class="location-right">
          <p class="background-box">MIT</p>
        </div>

        <div class="location-left">
          <p class="background-box">HTTPS</p>
        </div>
        <div class="location-right">
          <p class="background-box">ISC</p>
        </div>

        <div class="location-left">
          <p class="background-box">Lodash</p>
        </div>
        <div class="location-right">
          <p class="background-box">MIT</p>
        </div>

        <div class="location-left">
          <p class="background-box">Request</p>
        </div>
        <div class="location-right">
          <p class="background-box">Apache License 2.0</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "MenuCredits"
};
</script>

<style>
.credits-container .grid-perminant div p {
  margin-top: 0px;
}
.credits-container .grid-perminant div:nth-child(2n + 1) .background-box {
  margin-right: 5px;
}
.credits-container .grid-perminant div:nth-child(2n) .background-box {
  margin-left: 5px;
}
</style>