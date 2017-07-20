/**
 * External dependencies
 */
import { connect } from 'react-redux';
import { localize } from 'i18n-calypso';
import { throttle } from 'lodash';
import React from 'react';
import debugFactory from 'debug';

/**
 * Internal dependencies
 */
import {
	getSelectedSite,
	getSelectedSiteId,
} from 'state/ui/selectors';
import addQueryArgs from 'lib/route/add-query-args';
import { setLayoutFocus } from 'state/ui/layout-focus/actions';
import { isWithinBreakpoint } from 'lib/viewport';

import DocumentHead from 'components/data/document-head';
import Main from 'components/main';
import WebPreviewContent from 'components/web-preview/content';

const debug = debugFactory( 'calypso:my-sites:preview' );

class PreviewMain extends React.Component {

	static displayName = 'Preview';

	state = {
		previewUrl: null,
		showingClose: false,
	};

	componentWillMount() {
		this.updateUrl();
		this.updateLayout();
	}

	updateLayout = () => {
		this.setState( {
			showingClose: isWithinBreakpoint( '<660px' ),
		} );
	}

	throttledUpdateLayout = throttle( this.updateLayout, 100 );

	componentDidMount() {
		global.window && global.window.addEventListener( 'resize', this.throttledUpdateLayout );
	}

	componentWillUnmount() {
		global.window && global.window.removeEventListener( 'resize', this.throttledUpdateLayout );
	}

	updateUrl() {
		if ( ! this.props.site ) {
			if ( this.state.previewUrl !== null ) {
				debug( 'unloaded page' );
				this.setState( { previewUrl: null } );
			}
			return;
		}

		const newUrl = addQueryArgs( {
			preview: true,
			iframe: true,
			'frame-nonce': this.props.site.options.frame_nonce
		}, this.getBasePreviewUrl() );

		if ( this.iframeUrl !== newUrl ) {
			debug( 'loading', newUrl );
			this.setState( { previewUrl: newUrl } );
		}
	}

	getBasePreviewUrl() {
		return this.props.site.options.unmapped_url;
	}

	componentDidUpdate( prevProps ) {
		if ( this.props.siteId !== prevProps.siteId ) {
			debug( 'site change detected' );
			this.updateUrl();
		}
	}

	focusSidebar = () => {
		this.props.setLayoutFocus( 'sidebar' );
	}

	render() {
		const { translate } = this.props;

		return (
			<Main className="preview">
				<DocumentHead title={ translate( 'Site Preview' ) } />
				<WebPreviewContent
					showClose={ this.state.showingClose }
					onClose={ this.focusSidebar }
					previewUrl={ this.state.previewUrl }
				/>
			</Main>
		);
	}
}

const mapState = ( state ) => ( {
	site: getSelectedSite( state ),
	siteId: getSelectedSiteId( state ),
} );

export default connect( mapState, { setLayoutFocus } )( localize( PreviewMain ) );
