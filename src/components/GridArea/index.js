
// MODULES
import React from 'react';
import LineTo from 'react-lineto';
import fs from 'fs';

// STYLES
import './GridArea.scss';

class GridArea extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isDraggable: false, // determine wether a machine should follow the cursor pos, trigger on onMouseDown
            machines: [], // include the infos about the machine
            updating: false, // just a dummy bool when I want to update the doms
            connections: [],
            machinesSize: 100
        }

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
        this.onMouseWheel = this.onMouseWheel.bind(this);
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
            ref: React.createRef(),
            createdAt: Date.now()
        };

        if (newMachine.ref.current) {
            this.setState({ machinesSize: newMachine.ref.current.style.width });
        }

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
                        onClick={(e) => {

                            function createConnection(from, to, fromAnchor, toAnchor) {
                                return {
                                    from,
                                    to,
                                    fromAnchor,
                                    toAnchor
                                }
                            }

                            let connection = {};

                            if (this.state.connections.length === 0) {

                                connection = createConnection(
                                    machine.ref.current.className, // from
                                    this.cursor.current.className, // to
                                    'left center',       // fromAnchor
                                    ''                   // toAnchor
                                );

                                this.setState({ 
                                    connections: [...this.state.connections, connection]
                                });

                            } else {

                                if (this.state.connections[this.state.connections.length - 1].to === 'cursor') {
                                    connection = createConnection(
                                        this.state.connections[this.state.connections.length - 1].from,
                                        machine.ref.current.className,
                                        'left center',
                                        ''
                                    );

                                    const currentConnections = [...this.state.connections];
                                    currentConnections.pop();
                                    currentConnections.push(connection);

                                    this.setState({ connections: [...currentConnections] });

                                } else {
                                    connection = createConnection(
                                        machine.ref.current.className,
                                        this.cursor.current.className,
                                        'left center',
                                        ''
                                    );

                                    this.setState({ 
                                        connections: [...this.state.connections, connection]
                                    });
                                }
                            }

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
                    from={from ? from : ''} to={to ? to : ''}
                />
            );
        });
    }

    onCursorMove(e) {
        this.setState({ updating: true });
        if (this.choosenMachine && this.state.isDraggable) {
            const choosenMachine = this.choosenMachine.current;
            choosenMachine.style.left = e.screenX + 'px'; // TODO Automize the decrease value by getting the width of the machine
            choosenMachine.style.top = e.screenY + 'px';
        }

        this.cursor.current.style.left = e.screenX + 'px';
        this.cursor.current.style.top = (e.screenY - 100) + 'px';
    }

    async onSave() {
        const machines = [...this.state.machines];
        const connections = [...this.state.connections];

        const configedMachines = machines.map((machine) => {

            const machinesConnections = connections.filter((connection) => {
                if (connection.from.includes(machine.id)) {
                    return connection;
                }
            });

            return {
                ...machine,
                ref: null,
                connections: machinesConnections
            }
        });

        const data = JSON.stringify(configedMachines);
        console.log(data);
    }

    onMouseWheel(e) {
        if (e.wheelDelta > 0) {
            this.state.machines.forEach((machine) => {

                this.state.machinesSize += 10;

                if (this.state.machinesSize < 100) {
                    this.state.machinesSize = 100;
                }
                machine.ref.current.style.width = (this.state.machinesSize + 'px');
                machine.ref.current.style.height = (this.state.machinesSize + 'px');
                machine.ref.current.style.margin = ((this.state.machinesSize ) + 'px')

            });
        } else {
            this.state.machines.forEach((machine) => {
                this.state.machinesSize -= 10;
                if (this.state.machinesSize < 100) {
                    this.state.machinesSize = 100;
                }
                machine.ref.current.style.width = (this.state.machinesSize + 'px');
                machine.ref.current.style.height = (this.state.machinesSize + 'px');
                machine.ref.current.style.margin = ((this.state.machinesSize ) + 'px')
            });
        }
    }

    componentDidMount() {
        // window.addEventListener('wheel', this.onMouseWheel);
    }

    componentWillUnmount() {
        // window.removeEventListener('wheel', this.onMouseWheel);
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

