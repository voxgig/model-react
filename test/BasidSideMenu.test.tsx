import { afterEach, beforeEach, describe, it } from 'vitest'
import * as React from 'react'

import { customRender, ctx, initialState } from './mocks/test-utils'
import { BasicSideMenu } from '../src/lib/index'

describe('BasicSideMenu', () => {
    const setLocation = (pathname: string) => {
        Object.defineProperty(window, 'location', {
            value: {
                pathname
            }
        });
    }

    beforeEach(() => {
        setLocation('/view/task');
    });

    afterEach(() => {
        setLocation(window.location.pathname);
    });

    it('happy', () => {

        const spec = {
            sectionList: {
                section1: {
                    title: "Section 1",
                    item: {
                        task: {
                            kind: 'resource',
                            label: 'Tasks',
                            icon: 'done',
                            path: '/view/tasks',
                            access: {
                                admin: true,
                                user: true
                            }
                        }
                    }
                }
            }
        }

        customRender(<BasicSideMenu spec={spec} onItemSelect={() => { }} onClose={() => { }} />, {
            mockInitialState: initialState,
        })
    })
})
