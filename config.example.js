export function identifiants(){
    const key="string"
    const urlGeneral = "url"
    const urlMprofil = `${urlGeneral}/users/me`
    const urlConnexion = `${urlGeneral}/auth/login`
    const urlDeconnexion = `${urlGeneral}/auth/logout`
    return {
        key : key,
        urlConnexion : urlConnexion,
        urlDeconnexion : urlDeconnexion,
        urlMprofil : urlMprofil
    }
}