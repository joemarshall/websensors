function newFetch()
{
    return fetch.apply(arguments);
};

window.fetch=newFetch;