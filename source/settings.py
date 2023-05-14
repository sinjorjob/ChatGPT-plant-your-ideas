# mindmap stype setting
STYLE_SETTING = """<style>
            mindmapDiagram {
            node {
                Padding 5
                Margin 15
                BackGroundColor Aquamarine
            }
            rootNode {
                Padding 15
                FontStyle Italic
                BackGroundColor LightSkyBlue
                FontColor black
            }
            leafNode {
                Padding 5
                BackGroundColor LightYellow
                FontColor black
                FontSize 15
            }
            }
            </style>
                """
# prompt 
UML_PROMPT ="""
The output should be compiled into a mind map and output in the following output format in [selected_language].

@startmindmap

* Item
** Item
*** Item
**** Item
**** Item
*** Item
**** Item
**** Item
*** Item
**** Item
**** Item
** Item
*** Item
**** Item
**** Item
*** Item
**** Item
**** Item
*** Item
**** Item
**** Item
** Item
*** Item
*** Item

@endmindmap
"""