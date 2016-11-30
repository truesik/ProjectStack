import React from "react";
import {Field} from "redux-form";

const normalizeTitle = value => value.replace(/[\W]+/g, '');

const renderField = ({input, name, label, type, readOnly, meta: {touched, error}}) => {
    return (
        <div className={!touched || !error ? "form-group" : "form-group has-error"}>
            <label htmlFor={name}>{label}</label>
            <input {...input}
                   placeholder={label}
                   type={type}
                   className="form-control"
                   id={name}
                   readOnly={readOnly}/>
            {touched && (error && <small className="help-block">{error}</small>)}
        </div>
    )
};

export default class AddChannelForm extends React.Component {
    componentDidMount() {
        const initialValues = {
            'community': this.props.communityTitle
        };
        this.props.initialize(initialValues);
    }

    render() {
        const {error, handleSubmit, pristine, reset, submitting, addChannel} = this.props;
        return (
            <form method="post" onSubmit={handleSubmit(addChannel)}>
                <Field name="title"
                       component={renderField}
                       type="text"
                       label="Title"
                       normalize={normalizeTitle}/>
                <Field name="description"
                       component={renderField}
                       type="text"
                       label="Description"/>
                <Field name="community"
                       component={renderField}
                       type="text"
                       label="Community"
                       readOnly/>
                {error && <span className="text-danger">{error}</span>}
                <button type="submit" className="pull-right btn btn-primary" disabled={submitting}>Create</button>
            </form>
        )
    }
};