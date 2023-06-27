export default async function fetchData(input: RequestInfo, init?: RequestInit) {
    const response = await fetch(input, init);
    if (response.ok) return response;
    const errorBody = await response.json();
    // const errorMsg = errorBody.console.error();
    // console.log(errorBody)
    throw new Error(errorBody.error)
}