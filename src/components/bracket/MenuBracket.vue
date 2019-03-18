<template>
  <div class="grid">
    <div class="location-centered bracket-container">
      <div class="bracket-qf bracket-sub-container">
        <div>
          <div class="bracket-alliance" />
        </div>
        <div>
          <div class="bracket-hor-line" />
        </div>

        <div>
          <div class="bracket-alliance" />
        </div>
        <div>
          <div class="bracket-hor-line" />
        </div>

        <div>
          <div class="bracket-alliance" />
        </div>
        <div>
          <div class="bracket-hor-line" />
        </div>

        <div>
          <div class="bracket-alliance" />
        </div>
        <div>
          <div class="bracket-hor-line" />
        </div>

        <div>
          <div class="bracket-alliance" />
        </div>
        <div>
          <div class="bracket-hor-line" />
        </div>

        <div>
          <div class="bracket-alliance" />
        </div>
        <div>
          <div class="bracket-hor-line" />
        </div>

        <div>
          <div class="bracket-alliance" />
        </div>
        <div>
          <div class="bracket-hor-line" />
        </div>

        <div>
          <div class="bracket-alliance" />
        </div>
        <div>
          <div class="bracket-hor-line" />
        </div>
      </div>

      <div class="bracket-sf bracket-sub-container">
        <div>
          <div class="bracket-hor-line" />
        </div>
        <div>
          <div class="bracket-alliance" />
        </div>
        <div>
          <div class="bracket-hor-line" />
        </div>

        <div>
          <div class="bracket-hor-line" />
        </div>
        <div>
          <div class="bracket-alliance" />
        </div>
        <div>
          <div class="bracket-hor-line" />
        </div>

        <div>
          <div class="bracket-hor-line" />
        </div>
        <div>
          <div class="bracket-alliance" />
        </div>
        <div>
          <div class="bracket-hor-line" />
        </div>

        <div>
          <div class="bracket-hor-line" />
        </div>
        <div>
          <div class="bracket-alliance" />
        </div>
        <div>
          <div class="bracket-hor-line" />
        </div>
      </div>

      <div class="bracket-f bracket-sub-container">
        <div>
          <div class="bracket-hor-line" />
        </div>
        <div>
          <div class="bracket-alliance" />
        </div>
        <div>
          <div class="bracket-hor-line" />
        </div>

        <div>
          <div class="bracket-hor-line" />
        </div>
        <div>
          <div class="bracket-alliance" />
        </div>
        <div>
          <div class="bracket-hor-line" />
        </div>
      </div>

      <div class="bracket-winner bracket-sub-container">
        <div>
          <div class="bracket-hor-line" />
        </div>
        <div>
          <div class="bracket-alliance" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "MenuBracket"
};
</script>

<style>
.bracket-container {
  display: grid;
  --a-width: 150px;
  --l-width: 15px;
  grid-template-columns:
    calc(var(--a-width) + var(--l-width)) repeat(
      2,
      calc(var(--l-width) + var(--a-width) + var(--l-width))
    )
    calc(var(--a-width) + var(--l-width));
}
.bracket-sub-container {
  display: grid;
}
.bracket-sub-container div {
  display: flex;
  flex-direction: column;
  justify-content: center;
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
.bracket-alliance {
  background-color: var(--box-color);
  box-shadow: var(--shadow);

  margin-top: 10px;
  margin-bottom: 10px;
  padding: 10px;
}
.bracket-hor-line {
  background: linear-gradient(
    180deg,
    rgba(0, 0, 0, 0) calc(50% - 1px),
    var(--neutral) calc(50%),
    rgba(0, 0, 0, 0) calc(50% + 1px)
  );

  padding-top: 10px;
  padding-bottom: 10px;
}
.bracket-vert-line {
  background: linear-gradient(
    90deg,
    rgba(0, 0, 0, 0) calc(50% - 1px),
    var(--neutral) calc(50%),
    rgba(0, 0, 0, 0) calc(50% + 1px)
  );

  padding-left: 5px;
  padding-bottom: 5px;
  margin-bottom: 50%;
  margin-top: 0px;
}
</style>