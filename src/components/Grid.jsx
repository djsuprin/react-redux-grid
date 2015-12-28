import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import Header from './layout/Header.jsx';
import Row from './layout/Row.jsx';
import PagerToolbar from './plugins/pager/Toolbar.jsx';
import Message from './plugins/errorhandler/Message.jsx';
import LoadingBar from './plugins/loader/LoadingBar.jsx';
import ColumnManager from './core/ColumnManager';
import Model from './plugins/selection/Model';
import Manager from './plugins/editor/Manager';
import { prefix } from '../util/prefix';
import { CLASS_NAMES } from '../constants/GridConstants';
import { getAsyncData, setData } from '../actions/GridActions';
import '../style/main.styl';

class Grid extends Component {

    static defaultProps = {
        columns: React.PropTypes.arrayOf(React.PropTypes.Object).isRequired,
        data: React.PropTypes.arrayOf(React.PropTypes.Object),
        dataSource: React.PropTypes.string,
        store: React.PropTypes.Func,
        pageSize: 25,
        events: React.PropTypes.Object,
        plugins: React.PropTypes.Object
    }

    componentWillMount() {
        const { dataSource, data, store } = this.props;
        
        if (dataSource !== React.PropTypes.string) {
            store.dispatch(getAsyncData(dataSource));
        }

        else if (data) {
            store.dispatch(setData(data));
        }

        else {
            console.warn('A data source, or a static data set is required');
        }
    }

    render() {

        const { 
            columns, 
            data, 
            pageSize,
            plugins,
            events,
            store
        } = this.props;

        const selectionModel = new Model(plugins, store, events);

        const columnManager = new ColumnManager(plugins, store, events);

        const editor = new Manager(plugins, store, events);

        const editorComponent = editor.getComponent();

        const containerProps = {
            className: prefix(CLASS_NAMES.CONTAINER)
        };

        const messageProps = {
            store
        };

        const headerProps = {
            selectionModel,
            columnManager,
            columns,
            plugins,
            store
        };

        const rowProps = {
            columnManager,
            columns,
            events,
            pageSize,
            plugins,
            store,
            selectionModel
        };

        const tableProps = {
            className: prefix(CLASS_NAMES.TABLE),
            cellSpacing: 0,
            store
        };

        const pagerProps = {
            pageSize,
            plugins,
            store
        };

        const loadingBarProps = {
            plugins
        };

        return (
            <div { ...containerProps }>
                <Message { ...messageProps } />
                <table { ...tableProps }>
                    <Header { ...headerProps } />
                    <Row { ...rowProps } />
                    <PagerToolbar { ...pagerProps } />
                </table>
                <LoadingBar { ...loadingBarProps } />
                { editorComponent }
            </div>
        );
    }
}

function mapStateToProps() {
    return {};
}

export default connect(mapStateToProps)(Grid);