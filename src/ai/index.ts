/* eslint-disable no-console */
import AggregateDetected from './AggregateDetected'
import NGeneAmplification from './NGeneAmplification'
import Orf1abAmplification from './Orf1abAmplification'
import RpCy5Amplification from './RpCy5Amplification'
import SGeneAmplfication from './SGeneAmplfication'

export const load = () => {
    const loaders = [
        AggregateDetected,
        NGeneAmplification,
        Orf1abAmplification,
        RpCy5Amplification,
        SGeneAmplfication
    ]

    Promise.all(loaders.map(l => l.getModel()))
        .then(() => console.log('All AI\'s have loaded successfully'))
        .catch(() => console.log('There was an issue loading the AI\'s'))
}
