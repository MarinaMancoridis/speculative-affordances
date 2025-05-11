import mapboxgl from "mapbox-gl"

const style = 
`<style>
    .mapboxgl-popup-content {
    font-family: Arial, sans-serif;
    padding: 10px 0px 4px 10px;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    width: 500px;
}

.popup-header {
    background-color: #4285f4;
    color: white;
    padding: 12px 15px;
    position: relative;
}

.property-name {
    margin: 0;
    font-size: 15px;
    font-weight: 600;
}

.popup-image {
    width: 100%;
    height: 160px;
    overflow: hidden;
}

.property-photo {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.popup-content {
    padding: 1px 10px 0px;
    background-color: white;
    
}

.property-address {
    margin: 0 0 15px 0;
    font-size: 14.5px;
    color: #222;
    line-height: 1.4;
    padding: 0;
    border-bottom: 1px solid #eee;
    font-weight: 500;
    font-family: "Segoe UI", Arial, sans-serif;
    letter-spacing: 0.2px;
}

.full-popup {
    display: grid;
    grid-template-columns: 1fr 1fr;
}

.property-details {
    gap: 10px
}

.detail-item {
    font-size: 13px;
    padding-left: 6px;
}

.detail-label {
    font-weight: 600;
    color: #666;
}

.highlight {
    grid-column: span 2;
    margin-top: 6px;
    padding: 6px;
    background-color: #f8f9fa;
    border-radius: 4px;
}

.highlight .detail-value {
    color: #4285f4;
    font-weight: 600;
}

.popup-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-top: 1px solid #eee;
    padding-top: 10px;
    margin-top: 5px;
}

.property-date {
    font-size: 12px;
    color: #999;
}

.maps-link {
    font-size: 12px;
    color: #4285f4;
    text-decoration: none;
}

.bottom-highlight {
    margin-top: 10px;
}

.maps-link:hover {
    text-decoration: underline;
}

</style>`

function formatDate(date) {
    const monthNames = ["January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
  
    const day = date.getDate();
    const monthIndex = date.getMonth();
    const year = date.getFullYear();
  
    return `${monthNames[monthIndex]} ${day}, ${year}`;
}

let popup;

export default function popupHome(home, map) {
    // console.log("homed:", home)
    const data = home;
    // const description = `<strong>${home.Address}</strong>`
    // const style = ``
    const description = `
    <div class="full-popup">
        <div class="full-header">
            <div class="popup-header">
                <h3 class="property-name">${data.Name}</h3>
            </div>
            
            <div class="popup-image">
                <img src="${data.popupURL}" alt="Property at ${data.StreetNum}" class="property-photo">
            </div>
            <div class="popup-footer">
            <div class="property-date">Record Date: ${data.Date}</div>
            <a href="${data.GoogleMapsURL}" target="_blank" class="maps-link">View on Google Maps</a>
            </div>
        </div>
        
        <div class="popup-content">
            <p class="property-address">${data.Address}</p>
            
            <div class="property-details">

            
            <div class="detail-item">
                <span class="detail-label">Bedrooms:</span>
                <span class="detail-value">${data.bedrooms}</span>
            </div>
            
            <div class="detail-item">
                <span class="detail-label">Bathrooms:</span>
                <span class="detail-value">${data.bathrooms}</span>
            </div>
            
            <div class="detail-item">
                <span class="detail-label">Living Area:</span>
                <span class="detail-value">${data.livingAreaValue} sq ft</span>
            </div>
            
            <div class="detail-item">
                <span class="detail-label">Year Built:</span>
                <span class="detail-value">${data.yearBuilt}</span>
            </div>
            ${data.dateLastSold ? `
            <div class="detail-item">
                <span class="detail-label">Last sold:</span>
                <span class="detail-value">${formatDate(new Date(data.dateLastSold))}</span>
            </div>`: ''}
            
            ${data.matchedZestimate ? `
            <div class="detail-item highlight bottom-highlight">
                <span class="detail-label">Zestimate:</span>
                <span class="detail-value">$${data.matchedZestimate.toLocaleString()}</span>
            </div>
            ` : ''}
            
            ${data.price ? `
            <div class="detail-item highlight">
                <span class="detail-label">Sold for:</span>
                <span class="detail-value">$${data.price.toLocaleString()}</span>
            </div>
            ` : ''}
            </div>
            
            
        </div>
    </div>`
    // if (popup) {popup.popup.remove()}
    const old = document.getElementsByClassName('mapboxgl-popup');
    if ( old.length ) {
        old[0].remove();
    }
    popup = new mapboxgl.Popup({
            closeButton: true,
            closeOnClick: true,
            className: 'marker-popup' // Custom class for styling
        })
        .setLngLat([home.Longitude, home.Latitude])
        .setHTML(style+description)
        .addTo(map);
    setTimeout(() => {
        const popupElement = popup.getElement();
        if (popupElement) {
            popupElement.style.zIndex = '1000'; // Set above
        }
    }, 0);
    
}