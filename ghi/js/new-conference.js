window.addEventListener('DOMContentLoaded', async () =>
{

    const url = 'http://localhost:8000/api/locations/';
    try
    {
        const response = await fetch(url);

        if (!response.ok)
        {
            throw new Error("Error" + response.status);
        } else
        {
            const data = await response.json();
            const selectTag = document.getElementById('location');
            for (let location of data.locations)
            {
                const option = document.createElement('option');
                option.value = location.id;
                option.innerHTML = location.name;
                selectTag.appendChild(option);
            }

        }

    } catch (e)
    {
        console.error(e);
    }

    const formTag = document.getElementById('create-conference-form');
    formTag.addEventListener('submit', async event =>
    {
        event.preventDefault();
        const formData = new FormData(formTag);
        const json = JSON.stringify(Object.fromEntries(formData));
        const conferenceUrl = 'http://localhost:8000/api/conferences/';
        const fetchConfig = {
            method: "post",
            body: json,
            headers: {
                'Content-Type': 'application/json',
            },
        };
        console.log("fetch", fetchConfig)
        const response = await fetch(conferenceUrl, fetchConfig);
        if (response.ok)
        {
            formTag.reset();
            const newConference = await response.json();
            console.log(newConference);
        }
    });

});
