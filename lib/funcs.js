exports.checkBodyFields = (body, mustIncludedThingsArray) => {
    const orgCandidates = Object.keys(body).filter(key => mustIncludedThingsArray.includes(key));
    let authenticatedBlanckFlag = false
    mustIncludedThingsArray.forEach((key)=>{
        if (body[key] === "") {
            authenticatedBlanckFlag = true
        }
    });
    
    const organization = [];
    orgCandidates.forEach((key)=>{
        if (body[key] !== "") {
            organization.push(body[key]);
        }
    });
    return {
        organization,
        authenticatedBlanckFlag
    }
}




