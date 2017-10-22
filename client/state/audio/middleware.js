/**
 * Internal dependencies
 */
import {
	HAPPYCHAT_RECEIVE_EVENT,
} from 'state/action-types';

const isAudioSupported = () => typeof window === 'object' && typeof window.Audio === 'function';

export const playSound = src => {
	if ( ! isAudioSupported() ) {
		return;
	}

	const audioClip = new window.Audio( src );
	audioClip.play();
};

export const playSoundForMessageToCustomer = ( dispatch, { event } ) => {
	// If the customer sent the message, there's no
	// need to play a sound to the customer.
	if ( event && event.source === 'customer' ) {
		return;
	}

	playSound( '/calypso/audio/chat-pling.wav' );
};

/**
 * Action Handlers
 */

// Initialized this way for performance reasons
export const handlers = Object.create( null );
handlers[ HAPPYCHAT_RECEIVE_EVENT ] = playSoundForMessageToCustomer;

/**
 * Middleware
 */

export default ( { dispatch } ) => ( next ) => {
	if ( ! isAudioSupported() ) {
		return next;
	}

	return action => {
		const handler = handlers[ action.type ];
		if ( 'function' === typeof handler ) {
			handler( dispatch, action );
		}

		return next( action );
	};
};
