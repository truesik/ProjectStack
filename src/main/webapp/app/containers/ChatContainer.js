import Chat from "../components/Chat";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import {getLastOpenedChannel} from "../actions/ChannelActions";
import {sendMessage} from "../actions/MessageActions";
import {connectToWebsocket, subscribeToTopic, unsubscribe} from "../actions/WebSocketActions";

const mapStateToProps = state => {
    return {
        currentChannelTitle: state.channelsReducer.currentChannelTitle,
        isConnected: state.websocketReducer.isConnected
    }
};

const mapDispatchToProps = dispatch => {
    return {
        getLastOpenedChannel: bindActionCreators(getLastOpenedChannel, dispatch),
        sendMessage: bindActionCreators(sendMessage, dispatch),
        connectToWebSocket: bindActionCreators(connectToWebsocket, dispatch),
        subscribeToTopic: bindActionCreators(subscribeToTopic, dispatch),
        unsubscribe: bindActionCreators(unsubscribe, dispatch)
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(Chat)