<script>
    export let intersectionObserver;
    export let house16;
    export let scale;
    export let opacity;
    export let bubblesVisible;
    export let zillowlogo;
    export let opendoorlogo;
    export let offerpadlogo;
    export let redfinlogo;
    export let bubblesY = [];
</script>

<!-- ■■■ Spacer to drive the grid animation ■■■ -->


<div class="scrolly-step spacer"></div>

<!-- a spacer so you actually scroll past before zoom begins -->
<div class="scrolly-step" style="height:0vh"></div>

<!-- this step holds the “Imagine” text + zooming image -->
<div class="scrolly-step zoom-house-step" use:intersectionObserver style="height:100vh;">
    <div class="zoom-house-container right">
        <img
            id="zoom-house"
            src={house16}
            alt="Zooming house"
            class = "outline"
            style="transform: translateY(-50%) scale({scale}); opacity: {opacity};"
        />
    
    <div class="zoom-house-text">
        <p><strong>You are eager to sell your three-bedroom home in Somerville.</strong> Normally, you'd tidy it up, stage it carefully, list it, and wait. You'd negotiate with buyers, navigate offers, and hope for the best possible outcome. But now, imagine instead—a click. Just one.</p>

        <p>
            <strong>A machine makes you an offer in seconds</strong>. No waiting, no uncertainty, no endless walkthroughs.
        </p>
        <br>
        <p class="note">
            Note: All depicted houses are currently on the Greater Boston housing market on Zillow.
        </p>
    </div>
</div>
  </div>


<!-- more content so you can scroll past -->
<div class="scrolly-step" style="height:20vh"></div>

<!-- bubble falling -->
{#if bubblesVisible}
    <div class="bubbles">
        {#each [zillowlogo, opendoorlogo, offerpadlogo, redfinlogo] as logo, i}
            <div class="bubble" style="top: {bubblesY[i]}vh;">
                <img src={logo} alt="iBuyer logo" />
            </div>
        {/each}
    </div>
{/if}


<div class="scrolly-step zoom-house-step" use:intersectionObserver style="height:10vh;">
    <div class="zoom-house-container center">
        <div class="zoom-house-text">
            <p>
                On the surface, this seems simple: a transaction at the speed of software. But speed obscures something deeper. Because <strong>this isn’t just about buying houses. It’s about how the algorithm sees value</strong>. It’s about which homes get chosen, which neighborhoods are entered—and which are avoided.
            </p>
        </div>
    </div>
</div>

<div class="scrolly-step" style="height:20vh"></div>


<div class="scrolly-step zoom-house-step" use:intersectionObserver style="height:100vh;">
    <div class="zoom-house-container center">
        <div class="zoom-house-text">
            <h2>Why does this matter?</h2>
            <p>
                As iBuyers rapidly expand—buying homes from Boston to Phoenix—their decisions aren't just commercial; <strong>they're reshaping communities</strong>. These algorithmic buyers don't just influence housing markets; they have the power to perpetuate historical inequalities or to challenge them.
            </p>
            <p>
                <strong>The aim of this project</strong> is to contextualize iBuying practices in the Greater Boston Area. Which homes get chosen—and why? Are the prices fair, or are biases quietly embedded in the algorithms themselves? By mapping Boston’s historically redlined neighborhoods, analyzing pricing data, and visualizing patterns of corporate ownership, we uncover how automated speculation impacts real lives, real homes, and real communities.
            </p>
        </div>
    </div>
</div>