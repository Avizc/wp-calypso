/**
 * External dependencies
 */
import { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

/**
 * Internal dependencies
 */
import { isRequestingSubscribedLists } from 'state/reader/lists/selectors';
import { requestSubscribedLists } from 'state/reader/lists/actions';

class QueryReaderLists extends Component {
	componentWillMount() {
		if ( this.props.isRequestingSubscribedLists ) {
			return;
		}

		this.props.requestSubscribedLists();
	}

	render() {
		return null;
	}
}

QueryReaderLists.propTypes = {
	isRequestingSubscribedLists: PropTypes.bool,
	requestSubscribedLists: PropTypes.func
};

QueryReaderLists.defaultProps = {
	requestSubscribedLists: () => {}
};

export default connect(
	( state ) => {
		return {
			isRequestingSubscribedLists: isRequestingSubscribedLists( state )
		};
	},
	( dispatch ) => {
		return bindActionCreators( {
			requestSubscribedLists
		}, dispatch );
	}
)( QueryReaderLists );
