# -*- coding: utf-8 -*-

from __future__ import division, print_function, unicode_literals

import os
import sys

import sphinx_rtd_theme


sys.path.insert(0, os.path.abspath('..'))
sys.path.append(os.path.dirname(__file__))
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "readthedocs.settings.dev")



sys.path.append(os.path.abspath('_ext'))
extensions = [
    'sphinx.ext.autodoc',
    'sphinx.ext.intersphinx',
	'sphinx.ext.autosectionlabel',
    'sphinx_rtd_theme',
    'myst_parser'
    
]
templates_path = ['_templates']

source_suffix = ['.rst', '.md']
# source_parsers = {
    
# }
myst_enable_extensions = ["attrs_inline", "html_image"]

master_doc = 'index'
project = u'DesktopBrailleRAP'
copyright = 'GPL V3'

version = '0.9.0'
release = '0.9.0'
exclude_patterns = ['_build']
default_role = 'obj'
pygments_style = 'sphinx'

#intersphinx_mapping = {
#    'python': ('http://python.readthedocs.io/en/latest/', None),
#    'django': ('http://django.readthedocs.io/en/1.8.x/', None),
#    'sphinx': ('http://sphinx.readthedocs.io/en/latest/', None),
#}
htmlhelp_basename = 'DesktopBrailleRAPdoc'
latex_documents = [
    ('index', 'DesktopBrailleRap.tex', u'DesktopBrailleRAP Documentation',
     u'BrailleRap Team', 'manual'),
]

#man_pages = [
#    ('index', 'read-the-docs', u'Read the Docs Documentation',
#     [u'Eric Holscher, Charlie Leifer, Bobby Grace'], 1)
#]

exclude_patterns = [
    # 'api' # needed for ``make gettext`` to not die.
]

language = 'fr' 

locale_dirs = [
    'locale/',
]
gettext_compact = False
gettext_uuid = False

html_theme = 'sphinx_rtd_theme'
#html_static_path = ['_static']
#html_theme_path = [sphinx_rtd_theme.get_html_theme_path()]
#html_theme_path = ["_themes"]
#html_logo = 'IMG/logo.svg' 

html_theme_options = {
    'logo_only': False,
    'display_version': True,
}

###########################################################
# moved from conf_rtd
###########################################################
import os.path
import re
import subprocess
import logging

def get_git_branch():
    """Get the git branch this repository is currently on"""
    path_to_here = os.path.abspath(os.path.dirname(__file__))

    # Invoke git to get the current branch which we use to get the theme
    try:
        p = subprocess.Popen(['git', 'branch'], stdout=subprocess.PIPE, cwd=path_to_here)

        # This will contain something like "* (HEAD detached at origin/MYBRANCH)"
        # or something like "* MYBRANCH"
        branch_output = p.communicate()[0]

        # This is if git is in a normal branch state
        match = re.search(r'\* (?P<branch_name>[^\(\)\n ]+)', branch_output)
        if match:
            return match.groupdict()['branch_name']

        # git is in a detached HEAD state
        match = re.search(r'\(HEAD detached at origin/(?P<branch_name>[^\)]+)\)', branch_output)
        if match:
            return match.groupdict()['branch_name']
    except Exception:
        logger.exception(u'Could not get the branch')

    # Couldn't figure out the branch probably due to an error
    return None



# Maps git branches to Sphinx themes
default_html_theme = 'sphinx_rtd_theme'
branch_to_theme_mapping = {
    # 3rd party themes
    'master': default_html_theme,
    'doc': 'alabaster',

    # Sphinx built-in themes
    'alabaster': 'alabaster',
    'classic': 'classic',
    'sphinxdoc': 'sphinxdoc',
    'scrolls': 'scrolls',
    'agogo': 'agogo',
    'traditional': 'traditional',
    'nature': 'nature',
    'haiku': 'haiku',
    'pyramid': 'pyramid',
    'bizstyle': 'bizstyle',
}
current_branch = get_git_branch()

if current_branch:
    sphinx_html_theme = branch_to_theme_mapping.get(current_branch, default_html_theme)
    print(u'Got theme {} from branch {}'.format(sphinx_html_theme, current_branch))
else:
    sphinx_html_theme = default_html_theme
    print(u'Error getting current branch - using default theme')


# -- Options for LaTeX output ------------------------------------------------

latex_elements = {
    # The paper size ('letterpaper' or 'a4paper').
    #
    'papersize': 'a4paper',

    # The font size ('10pt', '11pt' or '12pt').
    #
    'pointsize': '12pt',

    # Additional stuff for the LaTeX preamble.
    #
    # 'preamble': '',

    # Latex figure (float) alignment
    #
    # 'figure_align': 'htbp',
}

# Grouping the document tree into LaTeX files. List of tuples
# (source start file, target name, title,
#  author, documentclass [howto, manual, or own class]).
latex_documents = [
    (master_doc, 'DesktopBrailleRAP.tex', project,
     u'BrailleRAP team', 'manual'),
]


# -- Options for manual page output ------------------------------------------

# One entry per manual page. List of tuples
# (source start file, name, description, authors, manual section).
man_pages = [
    (master_doc, 'BrailleRAPman', project,
     [author], 1)
]


# -- Options for Texinfo output ----------------------------------------------

# Grouping the document tree into Texinfo files. List of tuples
# (source start file, target name, title, author,
#  dir menu entry, description, category)
texinfo_documents = [
    (master_doc, 'DesktopBrailleRAPtexinfo', project,
     author, 'DesktopBrailleRAPtexinfo', 'Page composition software for Open source DIY Braille embosser BrailleRAP.',
     'Miscellaneous'),
]

###########################################################
# end moved from conf_rtd
###########################################################

def setup(app):
    #app.add_stylesheet('css/custom.css')
    app.add_css_file('css/custom.css')
    pass



