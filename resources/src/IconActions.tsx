import { Grid } from '@geist-ui/react'
import { useInView } from 'react-intersection-observer'
import { IconActionHelp } from './IconActionHelp'
import { IconActionJump } from './IconActionJump'
import { IconActionFilter } from './IconActionFilter'
import { IconActionHighlight } from './IconActionHighlight'
import { IconActionSearch } from './IconActionSearch'
import './IconActions.css'

const IconActions = () => {
  const { ref, inView } = useInView()

  let floatingClasses = 'floating-right'
  if (inView) {
    floatingClasses += ' hidden'
  }

  return (
    <>
      <div ref={ref}>
        <Grid.Container gap={2} justify="space-between">
          <Grid>
            <IconActionHelp />
          </Grid>
          <Grid>
            <IconActionJump />
            <IconActionFilter />
            <IconActionHighlight />
            <IconActionSearch />
          </Grid>
        </Grid.Container>
      </div>

      <div className={floatingClasses}>
        <Grid.Container direction="column" gap={0.5}>
          <Grid>
            <IconActionSearch side />
          </Grid>
          <Grid>
            <IconActionFilter side />
          </Grid>
          <Grid>
            <IconActionHighlight side />
          </Grid>
          <Grid>
            <IconActionJump side />
          </Grid>
        </Grid.Container>
      </div>
    </>
  )
}

export { IconActions }
