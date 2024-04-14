export const generateUrl = (props) => {
    
    // Pass on the port # if specified
    const urlPort = window.location.port ? `:${window.location.port}` : '';
    
    // Construct the query string for auto start if needed
    const queryString = props.autoStart ? '?start=auto' : '';

    // Return the full URL with the appropriate path and query string
    return `${window.location.protocol}//${window.location.hostname}${urlPort}/${props.level}${queryString}`;
}
