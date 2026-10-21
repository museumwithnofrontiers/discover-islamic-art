<template>
  <div class="loader-container">
    <!-- Contains CSS animation for loader "icon" -->
    <div class="loader"></div>
    <div class="loading">Loading...</div>
  </div>
</template>

<script>
export default { name: "LoaderComponent" };
</script>

<style>
.loader-container {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  width: 100%;
  color: var(--text-dark);
  background-color: var(--content-bg);
}
.loader {
  height: 50px;
  width: 50px;
  border: 5px solid var(--loader-light);
  border-top: 5px solid var(--loader-dark);
  border-radius: 50%;
  margin: 15px;
  animation: spin 1.5s ease-in-out infinite;
}
@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
