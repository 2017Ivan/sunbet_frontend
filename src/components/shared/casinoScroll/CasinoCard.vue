<template>
  <div class="casino-card" @click="$router.push(`/casino/${game.id}`)">
    <!-- Game image area -->
    <div class="card-img" :style="{ background: game.bg }">
      <span class="card-emoji">{{ game.emoji }}</span>
      <div class="card-overlay">Play Now</div>
    </div>

    <!-- HOT / NEW badge -->
    <span v-if="game.badge" class="badge" :class="game.badge === 'NEW' ? 'badge--new' : 'badge--hot'">
      {{ game.badge }}
    </span>

    <!-- Info -->
    <div class="card-info">
      <p class="card-name">{{ game.name }}</p>
      <p class="card-tag">{{ game.tag }}</p>
    </div>
  </div>
</template>

<script setup>
defineProps({
  game: {
    type: Object,
    required: true,
  },
})
</script>

<style scoped>
.casino-card {
  flex-shrink: 0;
  width: 130px;
  border-radius: 14px;
  overflow: hidden;
  position: relative;
  cursor: pointer;
  border: 1px solid #2A2A2A;
  transition: border-color 0.2s, transform 0.2s;
}
.casino-card:hover {
  border-color: #A32D2D;
  transform: translateY(-3px);
}

/* Image area */
.card-img {
  width: 130px;
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
}

.card-emoji {
  font-size: 40px;
  pointer-events: none;
  user-select: none;
}

.card-overlay {
  position: absolute;
  inset: 0;
  background: rgba(163, 45, 45, 0.88);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  font-weight: 700;
  color: #fff;
  opacity: 0;
  transition: opacity 0.25s;
}
.casino-card:hover .card-overlay {
  opacity: 1;
}

/* Badge */
.badge {
  position: absolute;
  top: 6px;
  right: 6px;
  font-size: 9px;
  font-weight: 800;
  padding: 2px 7px;
  border-radius: 999px;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}
.badge--hot {
  background: #F59E0B;
  color: #1a0a00;
}
.badge--new {
  background: #22C55E;
  color: #001a0c;
}

/* Info */
.card-info {
  background: #161616;
  padding: 8px 10px;
}

.card-name {
  font-size: 12px;
  font-weight: 700;
  color: #fff;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.card-tag {
  font-size: 10px;
  color: #606060;
  margin-top: 2px;
}
</style>