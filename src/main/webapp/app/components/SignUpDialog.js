import React from "react";
import ReactDOM from "react-dom";

import SignUpFormContainer from "../containers/SignUpFormContainer";

export default class SignUpDialog extends React.Component {
    componentDidMount() {
        const node = ReactDOM.findDOMNode(this);
        $(node).on('hidden.bs.modal', () => {
            if (this.props.isShown) {
                this.props.hide();
            }
        })
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.isShown !== nextProps.isShown) {
            if (nextProps.isShown) {
                ::this.showModal();
            } else {
                ::this.hideModal();
            }
        }
    }

    showModal() {
        const node = ReactDOM.findDOMNode(this);
        $(node).modal('show');
    }

    hideModal() {
        const node = ReactDOM.findDOMNode(this);
        $(node).modal('hide');
    }

    render() {
        return (
            <div className="modal fade"
                 tabIndex="-1"
                 role="dialog"
                 aria-labelledby="myModalLabel"
                 aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content" style={{overflow: 'auto', paddingBottom: '15px'}}>
                        <div className="modal-header">
                            <button type="button" className="close" data-dismiss="modal">
                                <span aria-hidden="true">&times;</span>
                                <span className="sr-only">Close</span>
                            </button>
                            <h4 className="modal-title" id="myModalLabel">Registration</h4>
                        </div>
                        <div className="modal-body">
                            <SignUpFormContainer signUp={this.props.signUp}/>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}