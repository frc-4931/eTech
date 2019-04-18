<template>
  <div class="grid">
    <div class="location-centered-small">
      <h1 class="background-box content-centered">About</h1>
      <div class="background-box">
        <p class="content-justified">
          eTech is an all-in-one web application that allows users to continue
          scouting when offline, and when the user revives their connection the
          information is automatically synced to all other devices, and their
          screens are updated in real time.
        </p>

        <p class="content-right">Running version: {{ version }}</p>
      </div>

      <p class="content-justified background-box">
        If you would like to contribute to eTech or get in contact with us
        regarding anything, you can at our
        <a
          href="https://github.com/frc-4931/eTech"
          target="_blank"
        >Github repository</a>.
      </p>
    </div>

    <div class="location-centered-small small-margin">
      <h1 class="background-box content-centered">
        Credits
      </h1>

      <div
        v-for="(credit) in credits"
        :key="credit"
        class="grid-perminant small-margin-sub"
      >
        <p class="background-box location-left">{{ credit[0]}}</p>
        <p
          v-for="recipient in credit[1]"
          :key="recipient"
          class="background-box location-right content-right"
        >{{ recipient }}</p>
      </div>
    </div>

    <div class="location-centered-small small-margin">
      <h1 class="background-box content-centered">
        Licenses
      </h1>

      <div
        v-for="license in licenses"
        :key="license"
        class="grid-perminant small-margin-sub"
      >
        <p class="background-box location-left">{{ license[0]}}</p>
        <p class="background-box location-right content-right">{{ license[1]}}</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "MenuCredits",
  data() {
    return {
      version: JSON.parse(
        unescape(process.env.PACKAGE_JSON || "%7Bversion%3A0%7D")
      ).version,
      credits: [
        ["Programming", ["James Crane", "Damian Kocher"]],
        ["User Interface", ["Damian Kocher"]]
      ],
      licenses: [
        ["Vue", "MIT"],
        ["Vue-CLI", "MIT"],
        ["Vue-Router", "MIT"],
        ["Vue-Scrollto", "MIT"],
        ["PouchDB", "Apache License 2.0"],
        ["PouchDB-Authentication", "Apache License 2.0"],
        ["Chalk", "MIT"],
        ["Command-Line-Args", "MIT"],
        ["Command-Line-Usage", "MIT"],
        ["HTTP", "BSD-2-Clause"],
        ["HTTP-Proxy", "MIT"],
        ["HTTPS", "ISC"],
        ["Lodash", "MIT"],
        ["Request", "Apache License 2.0"]
      ]
    };
  }
};
</script>