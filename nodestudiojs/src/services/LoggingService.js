let logs = [];

export const log = (...message) =>  {
    
    if(message[1]['detail'])
        console.error(message);
    else 
        console.log(message);

    const updatedAt = (new Date()).toLocaleString();
    const formattedMessage = message.map((m) => {
        if (m['message']) return { message: m['message'] };
        if (m['detail']) return { error: m['detail']['error'] };
        return m;
    });
    const _log = JSON.stringify(formattedMessage);
    logs.push(`${updatedAt}: ${_log}`);
}

export const getLogs = () => {
    return logs;
}

export const clearLogs = () => {
    logs = [];
}