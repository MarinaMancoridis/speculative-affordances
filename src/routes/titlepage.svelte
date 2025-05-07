<script>
    export let cols;
    export let rows;
    export let replaceCount;
    export let modifiedImgs;
    export let originalImgs;
    export let rotatingImage;
    export let scrollToExplore;
</script>

<div class="grid-bg">
    {#each Array(cols*rows) as _, i}
      <div
        class="grid-cell"
        style="background-image:
                 url({ i < replaceCount
                          ? modifiedImgs[i]
                          : originalImgs[i]
                      });
               ">
      </div>
    {/each}
</div>

<div class="title-section">
    <div class="rotator">
      <img src={$rotatingImage} alt="Rotating title image" />
    </div>
  
    <div class="title-text">
      <h1>AUTOMATION AND SPECULATION</h1>
      <p class="typewriter-line" id="typewriter"></p>
      <p>
        <b>Speculative Affordances, Final Project:</b>
        <br>
        <i>Lena Armstrong, Marina Mancoridis, Eagon Meng, Jon Rosario</i>
      </p>
    </div>
  
    <!-- now sibling of .title-text -->
    <button class="scroll-indicator" on:click={scrollToExplore} type="button">
      <span>Explore</span>
      <div class="arrow" style="margin-left:0.8rem;">↓</div>
    </button>
</div>