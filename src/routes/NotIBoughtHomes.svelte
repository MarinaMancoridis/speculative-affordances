<script>
    export let homes = []; // Accept homes as a prop

    let hoveredHouse = null;
    let selectedHouse = null;
    let notiBoughtHomes = [];

    const selectedHomeAddresses = [
        "2 Front Street, Natick, MA 01760-6019, USA", 
        "37 Halliday Street, Boston, MA 02131-2210, USA", 
        "15 Fensmere Road, Boston, MA 02132-6011, USA"
    ];

    $: notiBoughtHomes = homes.filter(home => 
        selectedHomeAddresses.includes(home.Address)
    );
</script>

<style>
    .home-selection {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        gap: 1rem;
        margin-top: 1rem;
    }

    .home-card-wrapper {
        width: 200px;
    }

    .home-card {
        width: 100%;
        border: none;
        background: none;
        cursor: pointer;
    }

    .home-card img {
        width: 100%;
        border-radius: 8px;
        transition: filter 0.3s ease;
    }

    .home-card img.grayscale {
        filter: grayscale(100%);
    }

    .house-details {
        margin-top: 2rem;
        text-align: center;
    }
</style>

<h1 style="text-align: center;">Which of these homes are <em>not</em> iBought?</h1>
<p style="max-width: 800px; margin: 0 auto; text-align: left;">Let's play a quick game: can you spot the homes that weren't snapped up by iBuyers?</p><br> 
<p style="max-width: 800px; margin: 0 auto; text-align: left;"><b>Click on a house to learn more about it</b>. Behind every house is a story—real people, real communities, real impacts. By engaging with details about <i>actual homes</i>, we hope to ground the abstract concept of iBuying in a real, lived experiences. </p>
<br>

<div class="home-selection">
    {#each notiBoughtHomes as home}
        <div class="home-card-wrapper">
            <button 
                class="home-card" 
                on:mouseover={() => hoveredHouse = home} 
                on:mouseout={() => hoveredHouse = null} 
                on:focus={() => hoveredHouse = home} 
                on:blur={() => hoveredHouse = null} 
                on:click={() => selectedHouse = home}
                class:selected={selectedHouse === home}
                aria-pressed={selectedHouse === home}
                aria-label={`Select House ${home}`}
            >
                <div class="image-container">
                    <img 
                        src={home.photoURL} 
                        alt={`${home}`} 
                        class:grayscale={hoveredHouse !== home && selectedHouse !== home}
                    />
                </div>
            </button>
        </div>
    {/each}
</div>

{#if selectedHouse !== null}
    <div class="house-details">
        <h2>This is <em>{selectedHouse.Address}</em></h2>
        <p>This is an iBought home!</p>
        <p>
            Originally built in {selectedHouse.yearBuilt}, it was last sold for <b>${selectedHouse.price}</b>, while its most recent Zestimate is <b>{selectedHouse.zestimate ? "$" + selectedHouse.zestimate : "unknown"}</b>.
        </p>
        <p>
            The home features {selectedHouse.bedrooms || "an unknown number of"} bedrooms and {selectedHouse.bathrooms || "an unknown number of"} bathrooms. It spans {selectedHouse.livingAreaValue} square feet of living area total.
        </p>
    </div>
{/if}
<br><br>
<p style="max-width: 800px; margin: 0 auto; text-align: left;">Surprise— <b>all</b> of the homes you've just seen were purchased by iBuyers! This trend isn't confined to a single neighborhood; it's reshaping diverse communities across the Greater Boston area. <i>Scroll down to explore</i> how these homes fit into the broader context of Boston's varied districts.</p>
<br><br>