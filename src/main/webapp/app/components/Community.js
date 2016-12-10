import React from "react";
import {Link} from "react-router";

const Community = ({community, action}) => {
    return (
        <div className="col-lg-3 col-md-3 col-sm-6 col-xs-12">
            <div className="panel panel-default">
                <div className="panel-body">
                    <q>{community.description}</q>
                </div>
                <div className="panel-footer">
                    <i className="material-icons">group</i>
                    <Link to={`/community/${community.title}`}>{community.title}</Link>
                    <a className="btn btn-primary pull-right"
                       onClick={() => action(community.title)}>
                        {community.subscribed ? "Leave" : "Join"}
                    </a>
                </div>
            </div>
        </div>
    )
};

export default Community;