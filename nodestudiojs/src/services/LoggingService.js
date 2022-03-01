let logs = [];

export const log = (message) =>  {
    console.log(message);

    const updatedAt = (new Date()).toLocaleString();
    const _log = JSON.stringify(message)
    logs.push(`${updatedAt}: ${_log}`);
}

export const getLogs = () => {
    return logs;
}

export const clearLogs = () => {
    logs = [];
}