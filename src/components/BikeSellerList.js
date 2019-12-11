import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Message } from 'primereact/message'
import { Button } from 'primereact/button';
import { InputSwitch } from 'primereact/inputswitch';
import { Growl } from 'primereact/growl';
import { actionCreators } from '../store/BikeSeller';
import "primereact/resources/themes/nova-light/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";


class BikeSellerList extends Component {

    constructor() {
        super();
        this.state = {};
        this.onBikeSellerSelect = this.onBikeSellerSelect.bind(this);
        this.dialogHide = this.dialogHide.bind(this);
        this.addNew = this.addNew.bind(this);
        this.save = this.save.bind(this);
        this.delete = this.delete.bind(this);       
        this.update = this.update.bind(this);
        this.validate = this.validate.bind(this);
        this.canBeSubmitted = this.canBeSubmitted.bind(this);
        
    }

    componentDidMount() {
        this.fetchData();
    }

    componentDidUpdate() {
        // This method is called when the route parameters change
        if (this.props.forceReload) {
            this.fetchData();
        }
    }

    fetchData() {
        this.props.requestBikeSellers();
        this.props.requestRoles();
    }

    updateProperty(property, value) {

        let touched = this.state.touched;
        touched[property]=true;
        this.setState({ touched: touched });
        let bikeSeller = this.state.bikeSeller;
        if(property==="role"){
            bikeSeller.roleId=value.id;
        }
        if (property==="status")  {            
            bikeSeller.status= value ? "activated":"deactivated";
        }else{
            bikeSeller[property] = value; 
        }        
        this.setState({ bikeSeller: bikeSeller });
    }

    onBikeSellerSelect(e) {
        this.newBikeSeller = false;
        this.setState({
            displayDialog: true,
            bikeSeller: Object.assign({}, e.data),
            touched: {
                nit:false,
	            fullName:false,
	            address:false,
	            phone: false,                               
	            penaltyPercentage:false
            }            
        });
    }

    dialogHide() {
        this.setState({ displayDialog: false });
    }

    validate(nit, fullName, phone, address, role,penaltyPercentage) {
        // true means invalid, so our conditions got reversed
        return {
            nit: nit.length === 0,
            fullName: fullName.length === 0,
            phone: phone === 0 || phone.length===0,
            address: address.length === 0,
            penaltyPercentage: penaltyPercentage<=0.0 || penaltyPercentage > 100.0 || penaltyPercentage.length===0,
            role: role == null
        };
    }

    canBeSubmitted() {
        if(this.state.displayDialog){
            const errors = this.validate(this.state.bikeSeller.nit, this.state.bikeSeller.fullName,
                this.state.bikeSeller.phone,this.state.bikeSeller.address,this.state.bikeSeller.role,
                this.state.bikeSeller.penaltyPercentage);
            const isDisabled = Object.keys(errors).some(x => errors[x]);
            return isDisabled;
        }
    }

    
    

    addNew() {        
        this.newBikeSeller = true;        
        this.setState({
            bikeSeller: {
                nit:"",
	            fullName:"",
	            address:"",
	            phone: "",
                roleId: null,
                role:null,                
	            penaltyPercentage:"",
	            status:"deactivated"
            }, 
            touched: {
                nit:false,
	            fullName:false,
	            address:false,
	            phone: false,                               
	            penaltyPercentage:false
            },          
            displayDialog: true
        });
    }   
    

    save() {        
        let bikeSeller = this.state.bikeSeller;        
        bikeSeller.role=null;   
        this.setState({ bikeSeller: bikeSeller });        
        this.props.saveBikeSeller(this.state.bikeSeller);
        this.dialogHide();
        this.growl.show({
            severity: 'success', detail: this.newBikeSeller ?
                "Data Saved Successfully" : "Data Updated Successfully"
        });   
    }

    delete() {
        if(window.confirm('Are you sure you wish to delete this item?')){;
            this.props.deleteBikeSeller(this.state.bikeSeller.id);
            this.dialogHide();
            this.growl.show({ severity: 'error', detail: "Data Deleted Successfully" });
        }
    }

    update() {
        this.props.updateBikeSeller(this.state.bikeSeller, this.state.bikeSeller.id);
        this.dialogHide();
        this.growl.show({
            severity: 'success', detail:  "Data Updated Successfully" });   
    }

    render() {

        let header = <div className="p-clearfix"
            style={{ lineHeight: '1.87em' }}>BikeSellers table</div>;

        let footer = <div className="p-clearfix" style={{ width: '100%' }}>
            <Button style={{ float: 'left' }} label="Add"
                icon="pi pi-plus" onClick={this.addNew} />
        </div>;

        let dialogFooter = <div className="ui-dialog-buttonpane p-clearfix">
            
            <Button className="p-button-danger"  label="Delete" hidden={this.newBikeSeller ? true : false}
                icon="pi pi-trash" onClick={this.delete}/>
            <Button className="p-button-success" disabled={this.canBeSubmitted()} label={this.newBikeSeller ? "Save" : "Update"} icon="pi pi-check"
                onClick={this.newBikeSeller ? this.save : this.update } />
        </div>;

        return (
            <div>
                <div>
                <h1>Welcome to InfoSeller CRUD!</h1>
                <p>Click on any row to edit or delete an item</p>    
                </div>
                <Growl ref={(el) => this.growl = el} />
                <DataTable value={this.props.bikeSellers} selectionMode="single"
                    header={header} footer={footer}
                    selection={this.state.selectedBikeSeller}
                    onSelectionChange={e => this.setState({ selectedBikeSeller: e.value })} onRowSelect={this.onBikeSellerSelect}
                    autoLayout={true}
                    responsive={true}>
                    
                    <Column field="nit" header="NIT" />
                    <Column field="fullName" header="Full Name" />
                    <Column field="address" header="Address" />
                    <Column field="phone" header="Phone" />
                    <Column field="role.roleName" header="Role" />
                    <Column field="role.comissionValue" header="Comission" />
                    <Column field="status" header="Status" />                    
                </DataTable>
                <Dialog className="p-dialog-content" visible={this.state.displayDialog} style={{ 'width': '380px' }}
                    header="BikeSeller Details" modal={true} footer={dialogFooter}
                    onHide={() => this.setState({ displayDialog: false })}>
                    {
                        this.state.bikeSeller &&

                        <div className="p-grid p-fluid">

                           
                            <div><label htmlFor="NIT">NIT</label></div>
                            <div>
                                <InputText id="NIT" style={{width:'88%'}} keyfilter="int" maxLength="15" placeholder="e.g. 123456789-4" className={this.state.bikeSeller.nit === "" && this.state.touched.nit ? "p-error" : ""}  onChange={(e) => { this.updateProperty('nit', e.target.value) }}
                                    value={this.state.bikeSeller.nit} />
                                    <Message severity="error" style={{float:'right',display: this.state.bikeSeller.nit === "" && this.state.touched.nit ? 'inline' : 'none'} } />
                            </div>
                           

                            <div style={{ paddingTop: '5px' }}>
                                <label htmlFor="fullName">Full Name</label></div>
                            <div>
                                <InputText id="fullName" placeholder="e.g. Mateo Hernandez" maxLength="100" style={{width:'88%'}} className={this.state.bikeSeller.fullName === "" && this.state.touched.fullName ? "p-error" : ""} keyfilter={/^[a-zA-Z\s]*$/} onChange={(e) => { this.updateProperty('fullName', e.target.value) }}
                                    value={this.state.bikeSeller.fullName} />
                                    <Message severity="error" style={{float:'right',display: this.state.bikeSeller.fullName === "" && this.state.touched.fullName ? 'inline' : 'none'} } />
                            </div>

                            <div style={{ paddingTop: '5px' }}>
                                <label htmlFor="address">Address</label></div>
                            <div>
                                <InputText id="address" placeholder="e.g. 2569 Austin avenue. Vancouver, Canada" maxLength="100" style={{width:'88%'}} className={this.state.bikeSeller.address === "" && this.state.touched.address ? "p-error" : ""} onChange={(e) => { this.updateProperty('address', e.target.value) }}
                                    value={this.state.bikeSeller.address} />
                                    <Message severity="error" style={{float:'right',display: this.state.bikeSeller.address === "" && this.state.touched.address ? 'inline' : 'none'} } />
                            </div>

                            <div style={{ paddingTop: '5px' }}>
                                <label htmlFor="phone">Phone</label></div>
                            <div>
                                <InputText id="phone" placeholder="e.g. 9998886655" maxLength="15" style={{width:'88%'}} className={this.state.bikeSeller.phone === "" && this.state.touched.phone ? "p-error" : ""} keyfilter="int" onChange={(e) => { this.updateProperty('phone', e.target.value !=="" ? parseInt(e.target.value, 10):"") }}
                                    value={this.state.bikeSeller.phone} />
                                    <Message severity="error" style={{float:'right',display: this.state.bikeSeller.phone === "" && this.state.touched.phone ? 'inline' : 'none'} } />
                            </div>        
                            

                            <div style={{ paddingTop: '5px' }}>
                                <label htmlFor="role">Role</label></div>
                            <div style={{width:'88%'}}>
                                
                                <Dropdown optionLabel="roleName" value={this.state.bikeSeller.role} options={this.props.roles}
					                onChange={e => {this.updateProperty('role', e.target.value) }} placeholder='Select a role'	/>
                                    
                            </div>

                            <div style={{ paddingTop: '5px' }}>
                                <label htmlFor="penaltyPercentage">Penalty percentage</label></div>
                            <div>
                                <InputText id="penaltyPercentage" keyfilter="num" maxLength="3" placeholder="e.g. 15" style={{width:'88%'}} className={(this.state.bikeSeller.penaltyPercentage >100.0 || this.state.bikeSeller.penaltyPercentage<0.0 || this.state.bikeSeller.penaltyPercentage === "") && this.state.touched.penaltyPercentage ? "p-error" : ""}
                                 disabled={this.newBikeSeller ? false : true} onChange={(e) => { this.updateProperty('penaltyPercentage', e.target.value !=="" ? parseFloat(e.target.value, 10):"") }}
                                    value={this.state.bikeSeller.penaltyPercentage} />
                                    <Message severity="error" style={{float:'right',display: (this.state.bikeSeller.penaltyPercentage >100.0 || this.state.bikeSeller.penaltyPercentage<0.0 || this.state.bikeSeller.penaltyPercentage === "") && this.state.touched.penaltyPercentage ? 'inline' : 'none'} } />
                            </div> 

                            <div style={{ paddingTop: '5px' }}>
                                <label htmlFor="status">Status: {this.state.bikeSeller.status}</label></div>
                            <div>
                                
                                <InputSwitch onLabel="activated"  offLabel="deactivated" checked={this.state.bikeSeller.status === "activated" ? true : false}  onChange={(e) => { this.updateProperty('status', e.target.value) }} />
                            </div>
                        </div>
                    }
                </Dialog>
            </div>
        )
    }
}

// Make bikeSellers array available in  props
function mapStateToProps(state) {
    return {
        bikeSellers: state.bikeSellers.bikeSellers,
        roles: state.bikeSellers.roles,
        loading: state.bikeSellers.loading,
        errors: state.bikeSellers.errors,
        forceReload: state.bikeSellers.forceReload
    }
}

export default connect(
    mapStateToProps,
    dispatch => bindActionCreators(actionCreators, dispatch)
)(BikeSellerList);