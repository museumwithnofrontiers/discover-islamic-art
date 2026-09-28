// Adapted from https://github.com/Intera/vue-zoom-on-hover

<template>
  <div
    class="zoom-on-hover"
    @mousemove="move"
    @mouseenter="zoom"
    @mouseleave="unzoom"
  >
    <img class="normal" ref="normal" :src="imgNormal" />
    <img class="zoom" ref="zoom" :src="imgZoom || imgNormal" />
  </div>
</template>

<script>
function pageOffset(el) {
  // -> {x: number, y: number}
  // Get the left and top offset of a DOM block element
  var rect = el.getBoundingClientRect(),
    scrollLeft = window.pageXOffset || document.documentElement.scrollLeft,
    scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  return {
    y: rect.top + scrollTop,
    x: rect.left + scrollLeft,
  };
}

export default {
  name: "ZoomComponent",
  props: ["imgNormal", "imgZoom", "scale", "disabled"],
  data() {
    return {
      scaleFactor: 1,
      resizeCheckInterval: null,
    };
  },
  methods: {
    zoom: function () {
      if (this.disabled) return;
      this.$refs.zoom.style.opacity = 1;
      this.$refs.normal.style.opacity = 0;
    },
    unzoom: function () {
      if (this.disabled) return;
      this.$refs.zoom.style.opacity = 0;
      this.$refs.normal.style.opacity = 1;
    },
    move: function (event) {
      if (this.disabled) return;
      var offset = pageOffset(this.$el);
      var zoom = this.$refs.zoom;
      var normal = this.$refs.normal;
      var relativeX = event.clientX - offset.x + window.pageXOffset;
      var relativeY = event.clientY - offset.y + window.pageYOffset;
      var normalFactorX = relativeX / normal.offsetWidth;
      var normalFactorY = relativeY / normal.offsetHeight;
      var x =
        normalFactorX *
        (zoom.offsetWidth * this.scaleFactor - normal.offsetWidth);
      var y =
        normalFactorY *
        (zoom.offsetHeight * this.scaleFactor - normal.offsetHeight);
      zoom.style.left = -x + "px";
      zoom.style.top = -y + "px";
    },
    initEventLoaded: function () {
      // Emit the "loaded" event if all images have been loaded
      var promises = [this.$refs.zoom, this.$refs.normal].map(function (image) {
        return new Promise(function (resolve, reject) {
          image.addEventListener("load", resolve);
          image.addEventListener("error", reject);
        });
      });
      var component = this;
      Promise.all(promises).then(function () {
        component.$emit("loaded");
      });
    },
    initEventResized: function () {
      var normal = this.$refs.normal;
      var previousWidth = normal.offsetWidth;
      var previousHeight = normal.offsetHeight;
      var component = this;
      this.resizeCheckInterval = setInterval(function () {
        if (
          previousWidth != normal.offsetWidth ||
          previousHeight != normal.offsetHeight
        ) {
          previousWidth = normal.offsetWidth;
          previousHeight = normal.offsetHeight;
          component.$emit("resized", {
            width: normal.width,
            height: normal.height,
            fullWidth: normal.naturalWidth,
            fullHeight: normal.naturalHeight,
          });
        }
      }, 1000);
    },
  },
  mounted() {
    if (this.$props.scale) {
      this.scaleFactor = parseInt(this.$props.scale);
      this.$refs.zoom.style.transform = "scale(" + this.scaleFactor + ")";
    }
    this.initEventLoaded();
    this.initEventResized();
  },
  updated: function () {
    this.initEventLoaded();
  },
  beforeUnmount: function () {
    this.resizeCheckInterval && clearInterval(this.resizeCheckInterval);
  },
};
</script>

<style scoped>
.zoom-on-hover {
  width: 100%;
  position: relative;
  overflow: hidden;
}
.zoom-on-hover .normal {
  display: block;
  height: 100%;
  width: 100%;
  object-fit: contain;
  object-position: left;
  max-height: 325px;
  width: 100%;
  display: block;
}
.zoom-on-hover .zoom {
  position: absolute;
  opacity: 0;
  transform-origin: top left;
}

/* IE-only */
@media only screen and (-ms-high-contrast: none), (-ms-high-contrast: active) {
  .zoom-on-hover {
    height: 325px;
  }
  .zoom-on-hover .normal {
    max-height: 100%;
    max-width: 100%;
    height: auto;
    width: auto;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    margin: auto;
  }
}
</style>
