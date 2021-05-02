
import React from 'react';
import LineTo from 'react-lineto';

// STYLES
import './GridArea.scss';

class GridArea extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isDraggable: false,
            machines: [],
            choosenMachine: 0,
            updating: false
        }

        this.choosenMachine = null;

        this.createMachine = this.createMachine.bind(this);
        this.onCursorMove = this.onCursorMove.bind(this);
    }

    createMachine(name) {
        let maxValue = 0;

        this.state.machines.forEach(machine => {
            if (machine.id > maxValue) {
                maxValue = machine.id
            }
        });

        const newMachine = {
            id: (maxValue + 1),
            name,
            connections: [],
            pos: {
                x: 0,
                y: 0
            },
            ref: React.createRef()
        };

        this.setState({ machines: [...this.state.machines, newMachine] });
    }

    renderMachines(machines) {
        return machines.map((machine, index) => {
            return (
                <div
                    key={index}
                    ref={machine.ref}
                    onMouseDown={(e) => {
                        this.setState({ isDraggable: true, choosenMachine: machine.id });
                        this.choosenMachine = machine.ref;
                    }}
                    onMouseUp={(e) => {
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
                        console.log(updatedMachines);
                    }}
                    className={`machine id${machine.id}`}
                >
                    {machine.name}

                    <button
                        onClick={() => {

                            const machineInfos = this.state.machines;
                            console.log(machineInfos);

                            this.setState({ updating: true });

                            //this.setState({ 
                            //    machines: this.state.machines.filter((thisMachine) => thisMachine.id !== machine.id) 
                            //});
                            
                        }}
                    >
                        Delete
                    </button>
                </div>
            );
        });

    }

    onCursorMove(e) {
        if (this.choosenMachine && this.state.isDraggable) {
            this.setState({ updating: true });
            this.choosenMachine.current.style.left = e.screenX - 50 + 'px'; // TODO Automize the decrease value by getting the width of the machine
            this.choosenMachine.current.style.top = e.screenY - 150 + 'px';
        }
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
                            <a 
                                href="#"
                                onClick={() => this.createMachine('Linux')}
                            >
                                Linux
                            </a>
                        </li>
                        <li>
                            <a 
                                href="#"
                                onClick={() => this.createMachine('Windows')}
                            >
                                Windows
                            </a>
                        </li>
                        <li>
                            <a 
                                href="#"
                                onClick={() => this.createMachine('MacOS')}
                            >
                                MacOS
                            </a>
                        </li>
                    </ul>

                    {this.renderMachines(this.state.machines)}

                    <button
                        onClick={() => {
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

                            // TODO Write all the infos to the machines.json
                            console.log(machinesInfo);
                        }}
                    >
                        Save
                    </button>

                    <LineTo from="id1" to="id2" toAnchor="top left" />
                </div>
            </>
        );
    }
}

export default GridArea;

