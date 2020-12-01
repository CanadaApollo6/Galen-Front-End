import React, { useContext } from 'react'
import { Button } from 'antd'
import { SampleDetermination, Amplification } from '../types'
import { PlateContext } from '../contexts/PlateContext'

type BaseAmpButtonProps = {
    determination: SampleDetermination
    amplification: Amplification
    color: string
}

const AmpButton: React.FC<BaseAmpButtonProps> = ({
    determination,
    amplification,
    color,
}) => {
    const { determinations, setDeterminations } = useContext(PlateContext)

    const isToggled = determination.amplifications.some((a) =>
        a.includes(amplification)
    )

    const style: React.CSSProperties = {
        backgroundColor: isToggled ? color : 'white',
        color: isToggled ? 'white' : color,
        width: 80,
    }

    const onClick = () => {
        if (isToggled) {
            const a = determination.amplifications.filter(
                (a) => a !== amplification
            )
            const d = determinations.map((d) =>
                d.well === determination.well ? { ...d, amplifications: a } : d
            )
            setDeterminations(d)
        } else {
            const a = [...determination.amplifications, amplification]
            const d = determinations.map((d) =>
                d.well === determination.well ? { ...d, amplifications: a } : d
            )
            setDeterminations(d)
        }
    }

    return (
        <Button style={style} onClick={onClick}>
            {amplification}
        </Button>
    )
}

type AmpButtonProps = { determination: SampleDetermination }

const NGeneButton: React.FC<AmpButtonProps> = ({ determination }) => (
    <AmpButton
        determination={determination}
        amplification="N Gene"
        color="blue"
    />
)

const SGeneButton: React.FC<AmpButtonProps> = ({ determination }) => (
    <AmpButton
        determination={determination}
        amplification="S Gene"
        color="green"
    />
)

const ORF1abButton: React.FC<AmpButtonProps> = ({ determination }) => (
    <AmpButton
        determination={determination}
        amplification="ORF1ab"
        color="red"
    />
)

const AmpButtons: React.FC<AmpButtonProps> = ({ determination: d }) => (
    <>
        <NGeneButton determination={d} />
        <SGeneButton determination={d} />
        <ORF1abButton determination={d} />
    </>
)

export default AmpButtons
