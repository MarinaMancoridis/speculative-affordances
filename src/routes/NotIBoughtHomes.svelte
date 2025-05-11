<script>
    export let homes = []; 

    let hoveredHouse = null;
    let selectedHouse = null;
    let notiBoughtHomes = [];
    let clickedHomes = new Set();

    const initialHomeAddresses = [
        "2 Front Street, Natick, MA 01760-6019, USA", 
        "17 Lakeshore Drive, Hopkinton, MA 01748-2737, USA", 
        "15 Fensmere Road, Boston, MA 02132-6011, USA"
    ];
    const numberHomes = 3;

    function isValidHouse(home) {
        return home.photoURL != null 
            && home.yearBuilt != null
            && home.price != null
            && !home.photoURL.includes("googleapis.com")
            ;
    }
    

    function getRandomHomes(homes, count) {
        let attempts = 0;
        const maxAttempts = 10;

        while (attempts < maxAttempts) {
            const shuffled = [...homes].sort(() => 0.5 - Math.random());
            const selectedHomes = shuffled.slice(0, count);

            if (selectedHomes.every(home => isValidHouse(home))) {
                return selectedHomes;
            }

            attempts++;
        }

        console.log("return to default")
        // default back to good ole initialHomeAddressess
        return initialHomeAddresses;
    }

    function resetGame() {
        hoveredHouse = null;
        selectedHouse = null;
        clickedHomes = new Set();


        if (notiBoughtHomes.length === 0) {
            notiBoughtHomes = homes.filter(home => 
                initialHomeAddresses.includes(home.Address)
            );
            console.log(homes);
        } else {
            notiBoughtHomes = getRandomHomes(homes, numberHomes);
        }
    }

    $: if (homes.length > 0 && notiBoughtHomes.length === 0) {
        resetGame();
    }

    $: allHomesClicked = clickedHomes.size === numberHomes;

    function handleClick(home) {
        clickedHomes.add(home);
        clickedHomes = new Set(clickedHomes);
        selectedHouse = home;
    }
</script>

<style>
    .home-selection {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        gap: 1rem;
        margin-top: 1rem;
        margin: auto 12rem;
    }

    .home-card-wrapper {
        position: relative;
        border-radius: 8px; /* Rounded corners for the wrapper */
        overflow: hidden; /* Ensure the overlay matches the image corners */
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); /* Subtle shadow for a clean look */
        border: 4px solid white; /* Add a white border */
    }

    .home-card {
        width: 100%;
        border: none;
        background: none;
        cursor: pointer;
    }

    .home-card img {
        width: 100%;
        object-fit: cover;
        border-radius: 8px; /* Rounded corners for the image */
        transition: filter 0.3s ease, transform 0.3s ease; /* Smooth hover effect */
    }

    .home-card img:hover {
        transform: scale(1.05); /* Slight zoom on hover */
    }

    .overlay-x {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: rgba(255, 0, 0, 0.5);
        color: white;
        font-size: 2rem;
        font-weight: bold;
        pointer-events: none;
        z-index: 0; 
    }

    .house-details {
        margin-top: 2rem;
        text-align: center;
        max-width: 800px;
        margin: 2rem auto;
        padding: 1rem;
        border-radius: 8px;
        background-color: #f9f9f9; 
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }

    .final-message {
        display: flex;
        align-items: center;
        justify-content: space-between;
        max-width: 1000px;
        margin: 1rem auto;
        padding: 1.5rem;
        border-radius: 8px;
        background-color: #f9f9f9;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        gap: 1.5rem;
    }

    .final-message p {
        flex: 1; 
        margin: 0;
        text-align: left;
    }

    .refresh-button {
        flex: 0 0 20%; /* Take up 20% of the width */
        padding: 10px 15px;
        font-size: 1rem;
        background-color: #644E8F;
        color: white;
        border: none;
        border-radius: 8px; /* Rounded corners for the button */
        cursor: pointer;
        text-align: center;
        transition: background-color 0.3s ease;
    }

    .refresh-button:hover {
        background-color: #523a72; /* Darker shade on hover */
    }
</style>

<h1 style="text-align: center;">Which of these homes are <em>not</em> iBought?</h1>
<p style="max-width: 800px; margin: 0 auto; text-align: left;">Let's play a quick game: can you spot the homes that weren't snapped up by iBuyers?</p><br> 
<p style="max-width: 800px; margin: 0 auto; text-align: left;"><b>Click on a house to learn more about it</b>. Behind every house is a story—real people, real communities, real impacts. By engaging with details about <i>actual homes</i>, we hope to ground the abstract concept of iBuying in a real, lived experience. </p>
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
                on:click={() => handleClick(home)}
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
            {#if clickedHomes.has(home)}
                <div class="overlay-x">X</div>
            {/if}
        </div>
    {/each}
</div>

{#if selectedHouse !== null}
  <div class="house-details">
    <p class="description">
      Below are the details for the selected property:
    </p>

    <h3 class="house-address">
      {selectedHouse.Address}
    </h3>

    <div class="ibought-announcement">
      This is an iBought Home!
    </div>

    <div class="house-info">
      <p class="info-item">
        <strong>Built</strong>: {selectedHouse.yearBuilt}
      </p>
      <p class="info-item">
        <strong>Last Sold</strong>:
          {selectedHouse.price 
            ? `$${selectedHouse.price}` 
            : selectedHouse.zestimate 
              ? `$${selectedHouse.zestimate}` 
              : "Unknown"}
      </p>
      <p class="info-item">
        <strong>Zestimate</strong>:
          {selectedHouse.zestimate 
            ? `$${selectedHouse.zestimate}` 
            : "Unknown"}
      </p>
      <p class="info-item">
        <strong>Bedrooms:</strong> {selectedHouse.bedrooms || "—"}
      </p>
      <p class="info-item">
        <strong>Bathrooms:</strong> {selectedHouse.bathrooms || "—"}
      </p>
      <p class="info-item">
        <strong>Living Area:</strong> {selectedHouse.livingAreaValue || "—"} sq ft
      </p>
    </div>
  </div>
{/if}

{#if allHomesClicked}
    <br><br>
    <div class="final-message">
        <p>Surprise— <b>all</b> of the homes you've just seen were purchased by iBuyers! This trend isn't confined to a single neighborhood; it's reshaping diverse communities across the Greater Boston area. <i>Scroll down to explore</i> how these homes fit into the broader context of Boston's varied districts.</p>
        <button class="refresh-button" type="button" on:click={resetGame}>Refresh</button>
    </div>
    <br><br>
{/if}