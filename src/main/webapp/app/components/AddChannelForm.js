import React from "react";
import ReactDOM from "react-dom";
// import $ from 'jquery';

export default class AddChannelForm extends React.Component {
    componentDidMount() {
        var node = ReactDOM.findDOMNode(this);
        $(node).modal('show');
        $(node).on('hidden.bs.modal', this.props.handleHideModal)
    }

    render() {
        return (
            <div className="modal fade" id="myModal" tabIndex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <button type="button" className="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span
                                className="sr-only">Close</span></button>
                            <h4 className="modal-title" id="myModalLabel">New channel</h4>
                        </div>
                        <div className="modal-body">
                            <form method="post" id="new-channel">
                                <div className="form-group">
                                    <label htmlFor="title">Title</label>
                                    <input type="text" className="form-control" id="title" name="title" placeholder="Title"/>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="description">Description</label>
                                    <input type="text" className="form-control" id="description" name="description"
                                           placeholder="Description"/>
                                </div>
                            </form>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-default" data-dismiss="modal">Close</button>
                            <button type="submit" className="btn btn-primary" id="create">Create</button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}