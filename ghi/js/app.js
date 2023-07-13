function createCard(name, description, pictureUrl, location, starts, ends)
{
    const formattedStarts = formatDate(starts);
    const formattedEnds = formatDate(ends);

    return `
        <div class="card shadow p-3 mb-3">
            <img src="${pictureUrl}" class="card-img-top" alt="...">
            <div class="card-body">
                <h5 class="card-title">${name}</h5>
                <h6 class="card-subtitle mb-4 text-secondary">${location}</h6>
                <p class="card-text">${description}</p>
            </div>
            <div class="card-footer">${formattedStarts} - ${formattedEnds}</div>
        </div>
    `;
}

function formatDate(dateString)
{
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, options);
}

function placeHolder()
{
    return `
        <div class="card">
            <div class="card shadow p-3" aria-hidden="true">
            <img src="https://i.pinimg.com/originals/09/e7/9b/09e79bb010560bc75b2d24c8bb80838d.gif" class="card-img-top" alt="...">
            <div class="card-body">
                <h5 class="card-title placeholder-glow">
                <span class="placeholder col-6"></span>
                </h5>
                <h5 class="card-subtitle placeholder-glow mb-3">
                <span class="placeholder col-6"></span>
                </h5>
                <p class="card-text placeholder-glow">
                <span class="placeholder col-7"></span>
                <span class="placeholder col-4"></span>
                <span class="placeholder col-4"></span>
                <span class="placeholder col-6"></span>
                <span class="placeholder col-8"></span>
                </p>
                <div class="card-footer">
                <span class="placeholder col-6"></span>
                </div>
            </div>
            </div>
        </div>
    `;
}

function alertError(message)
{
    const errorPopup = document.querySelector('.error-popup');
    errorPopup.textContent = message;
    errorPopup.style.display = 'block'
}


window.addEventListener('DOMContentLoaded', async () =>
{
    const url = 'http://localhost:8000/api/conferences/';

    try
    {
        const response = await fetch(url);

        if (!response.ok)
        {
            console.error("Bad Response")
            // Figure out what to do when the response is bad
        } else
        {
            const data = await response.json();
            const columnsContainer = document.querySelector('.columns-container');

            columnsContainer.innerHTML = '';

            // Add placeholders to columns
            for (let i = 0; i < data.conferences.length; i++)
            {
                const column = document.createElement('div');
                column.className = 'col-md-4 d-flex';
                column.innerHTML = placeHolder();
                columnsContainer.appendChild(column);
            }



            // Fetch and populate actual card data
            const columns = document.querySelectorAll('.columns-container .col-md-4');
            const conferences = data.conferences;

            for (let i = 0; i < conferences.length; i++)
            {
                const conference = conferences[i];
                const detailUrl = `http://localhost:8000${conference.href}`;
                const detailResponse = await fetch(detailUrl);

                if (detailResponse.ok)
                {
                    const details = await detailResponse.json();
                    const name = details.conference.name;
                    const description = details.conference.description;
                    const pictureUrl = details.conference.location.picture_url;
                    const location = details.conference.location.name;
                    const starts = details.conference.starts;
                    const ends = details.conference.ends;
                    const html = createCard(name, description, pictureUrl, location, starts, ends);
                    columns[i % 6].innerHTML = html;
                    const column = document.createElement('div');
                    column.className = 'col-md-4';
                    column.innerHTML = html;
                    // columnsContainer.appendChild(column);

                    // columns[i % 6].style.marginTop = '0';
                    // columns[i % 6].style.marginBottom = '0';
                }


            }

        }
    } catch (e)
    {
        const notifyError = `${e}`;
        console.error(notifyError); // Figure out what to do if an error is raised
        alertError(notifyError);
    }
});
