document.addEventListener('DOMContentLoaded', function() {
    const agentData = [
        { name: 'i-015e24c70f656e0ed', lastRun: '', status: 'Idle', version: '2.217.2', enabled: true, online: false },
        { name: 'i-01a0be2425ab60a87', lastRun: '', status: 'Idle', version: '2.217.2', enabled: true, online: true },
        { name: 'i-038047fa09db9d929', lastRun: '2h ago', status: 'Idle', version: '2.217.2', enabled: true, online: true },
        { name: 'i-04b2852c4acd1269d', lastRun: '', status: 'Idle', version: '2.217.2', enabled: true, online: false },
        { name: 'i-078f3669add1b291a', lastRun: '', status: 'Idle', version: '2.217.2', enabled: true, online: true },
        { name: 'i-093de4af5f7e54d63', lastRun: '1h ago', status: 'Idle', version: '2.217.2', enabled: true, online: true }
    ];

    const tableBody = document.querySelector('#agentTable tbody');

    function renderAgents() {
        tableBody.innerHTML = '';
        agentData.forEach(agent => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>
                    <span class="status-indicator ${agent.online ? 'online' : 'offline'}"></span>
                    ${agent.name}
                </td>
                <td>${agent.lastRun}</td>
                <td>${agent.status}</td>
                <td>${agent.version}</td>
                <td>
                    <label class="toggle">
                        <input type="checkbox" ${agent.enabled ? 'checked' : ''}>
                        <span class="slider"></span>
                    </label>
                </td>
            `;
            tableBody.appendChild(row);
        });
    }

    renderAgents();

    document.getElementById('updateAll').addEventListener('click', function() {
        alert('Updating all agents...');
    });

    document.getElementById('newAgent').addEventListener('click', function() {
        alert('Creating new agent...');
    });
});
