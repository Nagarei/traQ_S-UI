<template>
  <button :class="$style.container"><slot /></button>
</template>

<style lang="scss" module>
.container {
  @include color-ui-primary;
  display: flex;
  cursor: pointer;
  padding: 12px 20px;
  &:hover {
    @include background-secondary;
  }
}
.label {
  font: {
    size: 1rem;
  }
}
</style>
