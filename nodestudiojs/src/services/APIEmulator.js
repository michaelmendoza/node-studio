import APIDataService from "./APIDataService";

const APIEmulator = {
    run: async (cmd_string) => {
        console.log('emulator run');
        const substrings = cmd_string.split();
        const cmd = substrings[0];
        switch(cmd) {
            case '':
                return '';
            case 'man':
                return `Allowed commands: graph clear`;
            case 'graph':
                return await APIDataService.getGraph();
            case 'timeout':
                return await new Promise(resolve => setTimeout(() => resolve('timeout'), 1000));
            default:
                return 'Error: Invalid command'
        }
    }
}

export default APIEmulator;