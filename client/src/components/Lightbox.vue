<template>
  <div class="hc-wrapper">
    <figure role="group" @click="showLightbox = true">
      <img class="hc-preview" :src="image" />
      <figcaption v-html="description" />
    </figure>

    <!-- lightbox container hidden with CSS -->
    <div
      class="hc-lightbox"
      @click="showLightbox = false"
      :class="{ show: showLightbox }"
    >
      <div
        class="hc-image"
        :style="{
          'background-image': `url('${image}')`,
        }"
      />
      <div class="hc-description" v-html="description" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'Lightbox',
  data() {
    return {
      showLightbox: false,
    };
  },
  props: {
    imagePath: {
      type: String,
      required: true,
      default: '',
    },
    description: {
      type: String,
      required: false,
      default: '',
    },
  },
  computed: {
    image() {
      return require(`@/assets/${this.imagePath}`);
    },
  },
};
</script>

<style lang="scss" scoped>
.hc-wrapper {
  display: inline-block;
  margin-right: 1rem;
  max-width: 20rem;
}

.hc-preview {
  max-height: 9rem;
  max-width: 18rem;
}

figure {
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-align: center;
  align-items: center;
  font-style: italic;
  font-size: smaller;
  margin: 0.5rem;
  padding: 0.5rem;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 5px 10px 0 rgb(0 0 0 / 25%);
  }

  & figcaption {
    max-width: 100%;
    margin-top: 0.5rem;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
}

.hc-lightbox {
  display: none;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 2;
  padding: 3rem;
  width: 100%;
  height: 100%;
  cursor: pointer;
  background-color: rgba(0, 0, 0, 0.9);

  &.show {
    display: flex;
  }
}

.hc-image {
  flex-grow: 1;
  width: 100%;
  background-repeat: no-repeat;
  background-position: center;
  background-size: contain;
}

.hc-description {
  padding: 2rem;
}
</style>