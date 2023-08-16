import userACL from "./access";


export const VEHICAL_URL = 'http://123.02.52.23:5002/customer'


export const getHeader = () => {
    let fetchData = userACL.atFetch(),
        domain = fetchData.domain;
        // domain = "DEMOTEST"
    return { headers: { 'accountName': domain, 'Content-Type': 'application/json' } }
}