
// MODULES
import React from 'react';
import LineTo from 'react-lineto';

// STYLES
import './GridArea.scss';

class GridArea extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isDraggable: false, // determine wether a machine should follow the cursor pos, trigger on onMouseDown
            machines: [], // include the infos about the machine
            updating: false, // just a dummy bool when I want to update the doms
            connections: []
        }

        this.machineElements = []; // acutal DOM Elements referring to machines div

        this.choosenMachine = null; // chosen machine DOM
        this.cursor = React.createRef();

        // binded functions
        this.onMachineDrag = this.onMachineDrag.bind(this);
        this.onMachineRelease = this.onMachineRelease.bind(this);
        this.onMachineDelete = this.onMachineDelete.bind(this);
        this.onSave = this.onSave.bind(this);
        this.createMachine = this.createMachine.bind(this);
        this.renderConnections = this.renderConnections.bind(this);
        this.onCursorMove = this.onCursorMove.bind(this);
    }

    createMachine(name) {
        let maxValue = 0;

        this.state.machines.forEach(machine => {
            if (machine.id > maxValue) {
                maxValue = machine.id
            }
        });

        const width = window.innerWidth;
        const height = window.innerHeight;

        const randomX = Math.floor(Math.random() * (width - width / 3) + 100) + 'px';
        const randomY = Math.floor(Math.random() * (height - height / 3) + 100) + 'px';

        const newMachine = {
            id: (maxValue + 1),
            name,
            connections: [],
            pos: {
                x: randomX,
                y: randomY
            },
            ref: React.createRef()
        };

        this.machineElements = [...this.machineElements, newMachine.ref];
        this.setState({ machines: [...this.state.machines, newMachine] });
    }

    onMachineDrag(e, machine) {
        this.setState({ isDraggable: true });
        this.choosenMachine = machine.ref;
    }

    onMachineRelease(e, machine) {
        this.setState({ isDraggable: false });
        // Update the choosen machine positions on mouse up
        const updatedMachines = this.state.machines.map((thisMachine) => {
            if (thisMachine.id === machine.id) {
                const { left, top } = this.choosenMachine.current.style;
                thisMachine.pos.x = left;
                thisMachine.pos.y = top;
            } 

            return thisMachine;
        });


        this.setState({ machines: updatedMachines });
    }

    onMachineDelete(e, machine) {

        this.setState({ 
            machines: this.state.machines.filter((thisMachine) => thisMachine.id !== machine.id) 
        });
        
    }

    renderMachines(machines) {
        return machines.map((machine, index) => {
            return (
                <div
                    key={index}
                    ref={machine.ref}
                    onMouseDown={(e) => this.onMachineDrag(e, machine)}
                    onMouseUp={(e) => this.onMachineRelease(e, machine)}
                    className={"machine id" + machine.id}
                    style={{ left: machine.pos.x, top: machine.pos.y }} 
                    // or machine.ref.current.style.left, machine.ref.current.style.top
                >
                    <h2>{machine.name}</h2>

                    <div 
                        className="connect1"
                        onClick={() => {

                            function createConnection(from, to, fromAnchor, toAnchor) {
                                return {
                                    from,
                                    to,
                                    fromAnchor,
                                    toAnchor
                                }
                            }

                            let connection = {};
                            const connections = this.state.connections;

                            if (!this.state.connections.length > 0) {

                                connection = createConnection(
                                    machine.ref.current, // from
                                    null, // to
                                    'left center',       // fromAnchor
                                    ''                   // toAnchor
                                );

                            } else {
                                if (!connections[connections.length - 1].to) {
                                    connection = createConnection(
                                        connections[connections.length - 1].from,
                                        machine.ref.current, // TODO DRAG AND DROP USE ON CONNECTIONS
                                        'left center',
                                        ''
                                    );
                                } else {

                                    connection = createConnection(
                                        machine.ref.current,
                                        null,
                                        'left center',
                                        ''
                                    );
                                }
                            }

                            this.setState({ connections: [...connections, connection] });
                        }}
                    />
                    <div 
                        className="connect2"
                        onClick={() => {
                            
                        }}
                    />
                    
                    <button
                        className="delete"
                        onClick={(e) => this.onMachineDelete(e, machine)}
                    >
                        Delete
                    </button>
                </div>
            );
        });

    }

    renderConnections(connections) {
        return connections.map((connection, index) => {
            const { from, to } = connection;
            return (
                <LineTo
                    key={index}
                    from={from ? from.className : ''} to={to ? to.className : ''}
                />
            );
        });
    }

    onCursorMove(e) {
        this.setState({ updating: true });
        if (this.choosenMachine && this.state.isDraggable) {
            const choosenMachine = this.choosenMachine.current;
            choosenMachine.style.left = e.screenX - 50 + 'px'; // TODO Automize the decrease value by getting the width of the machine
            choosenMachine.style.top = e.screenY - 150 + 'px';
        }

        this.cursor.current.style.left = e.screenX + 'px';
        this.cursor.current.style.top = (e.screenY - 100) + 'px';
    }

    onSave() {
        const machinesInfo = this.state.machines.map((machine, index) => {

            if (!machine || !machine.ref || !machine.ref.current) {
                throw new Error('Machine is null');
            }

            const info = {
                id: machine.id,
                name: machine.name,
                pos: {
                    x: machine.ref.current.style.left,
                    y: machine.ref.current.style.top
                },
                createdAt: Date.now()
            }

            return info;
        });

        console.log(machinesInfo, this.state.connections);
    }

    render() {
        return (
            <>
                <div 
                    className="grid"
                    onMouseMove={this.onCursorMove}
                >
                    <ul>
                        <li>
                            <button
                                onClick={() => this.createMachine('Linux')}
                            >
                                Linux
                            </button>
                        </li>
                        <li>
                        <button
                                onClick={() => this.createMachine('Windows')}
                            >
                                Windows
                            </button>
                        </li>
                        <li>
                        <button
                                onClick={() => this.createMachine('MacOS')}
                            >
                                MacOS
                            </button>
                        </li>
                    </ul>

                    {this.renderMachines(this.state.machines)}
                    {this.renderConnections(this.state.connections)}

                    <button onClick={this.onSave}>
                        Save
                    </button>

                    <div 
                        className="cursor"
                        ref={this.cursor}
                    >

                    </div>
                </div>
            </>
        );
    }
}

export default GridArea;

