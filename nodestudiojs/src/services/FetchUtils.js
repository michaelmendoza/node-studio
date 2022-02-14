
export const FetchTypes = {
    'POST': 'POST',
    'GET': 'GET',
}

export const fetchAPI = (url, type, payload) => {
    let options = {
        'POST': createPostOptions,
        'GET': createGetOptions
    }

    return fetch(url, options[type](payload)).then(handleMiddleware);
}

export const handleMiddleware = (response) => {
    const p = new Promise(resolve => resolve(response));

    return p.then(handleErrors)
        .then(data => { console.log(data); return data.data; })
        .catch(error => console.log(error));
}

export const handleErrors = (response) => {
    if (!response.ok) {
        console.log(response);
        //throw Error(response.statusText);
    }
    return response.json();
}

export const createPostOptions = (body) => ({ 
    method: 'POST', 
    headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json;charset=UTF-8'   
    },
    body: JSON.stringify(body)
});

export const createGetOptions = () => ({ 
    method: 'GET', 
    headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json;charset=UTF-8'
    }
});