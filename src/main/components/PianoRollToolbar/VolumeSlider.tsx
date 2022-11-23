import styled from "@emotion/styled"
import { VolumeUp } from "@mui/icons-material"
import { observer } from "mobx-react-lite"
import React, { FC, useCallback } from "react"
import { setTrackVolume } from "../../actions"
import { useStores } from "../../hooks/useStores"
import { Slider } from "../inputs/Slider"

const Container = styled.div`
  display: flex;
  width: 8rem;
  margin-left: 1rem;
  margin-right: 1rem;
  align-items: center;
`

const VolumeIcon = styled(VolumeUp)`
  color: ${({ theme }) => theme.secondaryTextColor};
  margin-right: 0.5rem;
`

export interface VolumeSliderProps {
  trackId: number
}

const _VolumeSlider: FC<VolumeSliderProps> = observer(({ trackId }) => {
  const rootStore = useStores()
  const volume = rootStore.pianoRollStore.currentVolume ?? 100
  const onChange = useCallback(
    (value: number) => setTrackVolume(rootStore)(trackId, value),
    [rootStore, trackId]
  )
  return (
    <Container>
      <VolumeIcon />
      <Slider
        value={volume}
        onChange={(value) => onChange(value)}
        max={127}
        minStepsBetweenThumbs={1}
      />
    </Container>
  )
})

export const VolumeSlider = React.memo(_VolumeSlider)
